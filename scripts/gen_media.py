# -*- coding: utf-8 -*-
# Sudonex media v2: Pexels image (download->webp, compressed) + DIFFERENT video (hotlinked, smaller res).
# image query != video query (distinct visuals), both topic-relevant. Unique per page.
# Usage: python scripts/gen_media.py [--reset] [--limit N] [--dry]
import json,os,re,sys,time,urllib.parse,urllib.request,subprocess
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CJSON=os.path.join(ROOT,'data','content.json'); IMGDIR=os.path.join(ROOT,'public','images')
CRED=os.path.join(ROOT,'data','media-credits.json'); KEY=open(os.path.join(ROOT,'.pexels.key')).read().strip()
RESET='--reset' in sys.argv; DRY='--dry' in sys.argv; LIMIT=None
for i,a in enumerate(sys.argv):
    if a=='--limit': LIMIT=int(sys.argv[i+1])
os.makedirs(IMGDIR,exist_ok=True)
d=json.load(open(CJSON,encoding='utf-8'))

# Distinct IMAGE vs VIDEO concepts per theme (so image and video look different but both on-topic)
THEMES=[
 (('sportsbook','betting exchange','sports betting','bookmaker'), 'sports stadium crowd', 'sports betting mobile app'),
 (('live casino','live dealer'), 'casino dealer cards', 'roulette wheel spinning'),
 (('crypto','blockchain','web3','bitcoin'), 'cryptocurrency coins', 'blockchain network animation'),
 (('slot','rng','rtp','jackpot'), 'slot machine reels', 'casino lights neon'),
 (('poker',), 'poker chips cards', 'poker table game'),
 (('roulette','table game'), 'casino roulette table', 'casino gambling chips'),
 (('payment','wallet','deposit','psp','gateway'), 'credit card online payment', 'financial data server'),
 (('kyc','aml','compliance','certification','license','testing','audit'), 'business documents signing', 'security data protection'),
 (('aggregator','api','integration','backend'), 'programming code screen', 'server data center'),
 (('server','hosting'), 'server room data center', 'cloud computing network'),
 (('mobile','app development','ios','android'), 'mobile app developer', 'smartphone technology interface'),
 (('security','fraud'), 'cyber security lock', 'digital security network'),
 (('support','maintenance','debugging'), 'it support team headset', 'computer engineer working'),
 (('hire','developer','team','staff'), 'software team office meeting', 'developers coding collaboration'),
 (('crm','marketing','retargeting','affiliate'), 'marketing analytics dashboard', 'business growth chart'),
 (('cost','pricing','budget'), 'business finance calculator', 'financial planning meeting'),
 (('mvp','roadmap','startup','scale','consultancy'), 'startup team whiteboard', 'business strategy meeting'),
 (('white label','turnkey','platform','enterprise','solutions'), 'modern technology office', 'software engineers team'),
 (('ui','ux','design'), 'ux designer workspace', 'user interface design'),
 (('casino','gambling','igaming'), 'casino gaming chips', 'online casino interface'),
]
def themed(path,p,idx):
    s=(path+' '+(p.get('primary_kw') or '')+' '+(p.get('seo_title') or '')).lower()
    for keys,qi,qv in THEMES:
        if any(k in s for k in keys): return (qi,qv)[idx]
    return ('modern business technology','digital technology abstract')[idx]
img_query=lambda path,p: themed(path,p,0)
vid_query=lambda path,p: themed(path,p,1)
slug_for=lambda path: re.sub(r'[^a-z0-9]+','-',path.strip('/').lower()).strip('-') or 'home'

# ---- reset: strip inserted media from bodies, clear credits, delete webp ----
if RESET and not DRY:
    for k,p in d.items():
        b=p.get('body_html') or ''
        b=re.sub(r'\n?<figure class="post-image">.*?</figure>\n?','',b,flags=re.S)
        b=re.sub(r'\n?<figure class="post-video"[^>]*>.*?</figure>\n?','',b,flags=re.S)
        p['body_html']=b
    for f in os.listdir(IMGDIR):
        if f.endswith('.webp'): os.remove(os.path.join(IMGDIR,f))
    json.dump({},open(CRED,'w',encoding='utf-8'))
    print('reset: stripped media from all bodies, cleared webp + credits')
cred=json.load(open(CRED,encoding='utf-8')) if os.path.exists(CRED) else {}
used_img=set(v['image_id'] for v in cred.values() if v.get('image_id'))
used_vid=set(v['video_id'] for v in cred.values() if v.get('video_id'))

img_cache={}; vid_cache={}
def api(u):
    r=urllib.request.Request(u,headers={'Authorization':KEY,'User-Agent':'Mozilla/5.0 (SudonexSEO)'})
    for _ in range(3):
        try:
            with urllib.request.urlopen(r,timeout=40) as x: return json.load(x)
        except Exception: time.sleep(2)
    return {}
def imgs(q):
    if q in img_cache: return img_cache[q]
    j=api('https://api.pexels.com/v1/search?'+urllib.parse.urlencode({'query':q,'per_page':80,'orientation':'landscape','size':'large'}))
    img_cache[q]=[{'id':p['id'],'src':p['src']['large'],'by':p.get('photographer'),'url':p.get('url')} for p in j.get('photos',[])]
    return img_cache[q]
def vids(q):
    if q in vid_cache: return vid_cache[q]
    j=api('https://api.pexels.com/videos/search?'+urllib.parse.urlencode({'query':q,'per_page':80,'orientation':'landscape','size':'medium'}))
    out=[]
    for v in j.get('videos',[]):
        fs=[f for f in v.get('video_files',[]) if f.get('file_type')=='video/mp4' and f.get('width')]
        # compress: prefer ~960 wide (lighter), else nearest <=960
        cand=sorted(fs,key=lambda f:abs((f.get('width') or 0)-960))
        pick=next((f for f in cand if (f.get('width') or 0)<=960),cand[0] if cand else None)
        if pick: out.append({'id':v['id'],'link':pick['link'],'by':v.get('user',{}).get('name'),'url':v.get('url')})
    vid_cache[q]=out; return out
def dl_webp(src,dest):
    try:
        raw=urllib.request.urlopen(urllib.request.Request(src,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read()
        open(dest+'.s','wb').write(raw)
        node="const s=require('sharp');s(%s).rotate().resize(1120,630,{fit:'cover'}).webp({quality:60,effort:5}).toFile(%s).then(i=>console.log(i.size)).catch(e=>{console.error(e.message);process.exit(1)})"%(json.dumps(dest+'.s'),json.dumps(dest))
        r=subprocess.run(['node','-e',node],cwd=ROOT,capture_output=True,text=True,timeout=60); os.remove(dest+'.s'); return r.returncode==0
    except Exception as e:
        print('  dl-err',str(e)[:50]); return False

done=ii=vi=0
for path,p in d.items():
    if LIMIT and done>=LIMIT: break
    slug=slug_for(path); body=p.get('body_html','') or ''
    has_i='/images/%s.webp'%slug in body; has_v='data-mediavideo="%s"'%slug in body
    if has_i and has_v: continue
    done+=1; e=cred.get(slug,{})
    h1=re.sub('<[^>]+>','',p.get('h1') or p.get('seo_title') or slug).strip(); alt=re.sub('"','',h1)[:110]
    if not has_i:
        pool=imgs(img_query(path,p)); pick=next((x for x in pool if x['id'] not in used_img),None)
        if pick:
            used_img.add(pick['id']); dest=os.path.join(IMGDIR,slug+'.webp')
            if DRY or dl_webp(pick['src'],dest):
                fig='\n<figure class="post-image"><img src="/images/%s.webp" alt="%s" width="1120" height="630" loading="lazy" decoding="async"/></figure>\n'%(slug,alt)
                m=re.search(r'</h2>.*?</p>',body,re.S); body=(body[:m.end()]+fig+body[m.end():]) if m else fig+body
                e.update(image_id=pick['id'],image_by=pick['by'],image_src=pick['url']); ii+=1
    if not has_v:
        pool=vids(vid_query(path,p)); pick=next((x for x in pool if x['id'] not in used_vid),None)
        if pick:
            used_vid.add(pick['id'])
            vid='\n<figure class="post-video" data-mediavideo="%s"><video controls preload="none" playsinline poster="/images/%s.webp" width="960" height="540" style="width:100%%;height:auto;border-radius:12px"><source src="%s" type="video/mp4"/></video></figure>\n'%(slug,slug,pick['link'])
            hs=list(re.finditer(r'</h2>.*?</p>',body,re.S))
            if len(hs)>=3: body=body[:hs[2].end()]+vid+body[hs[2].end():]
            elif hs: body=body[:hs[-1].end()]+vid+body[hs[-1].end():]
            else: body+=vid
            e.update(video_id=pick['id'],video_by=pick['by'],video_src=pick['url'],video_link=pick['link']); vi+=1
    p['body_html']=body
    if e: cred[slug]=e
    if not DRY: time.sleep(0.08)
    print('[%d] %s  img="%s" vid="%s"'%(done,path,img_query(path,p),vid_query(path,p)))
if not DRY:
    json.dump(d,open(CJSON,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
    json.dump(cred,open(CRED,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('\nDONE pages=%d img+=%d vid+=%d uniq_img=%d uniq_vid=%d'%(done,ii,vi,len(used_img),len(used_vid)))
