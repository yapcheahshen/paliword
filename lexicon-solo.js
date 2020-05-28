/*not found in compound word*/
const solo=`
api=也
ahaṃ=我
ca=且
cā=且
hi=确实
kiñca=某
kiñci=某
kiṃ=何?
ko=誰?
maṃ=我
me=我
mayā=我
mayaṃ=我
mayhaṃ=我
na=不
mā=別
naṃ=彼
netaṃ=?
neva=确实不
no=否
nu=否?
pe=略
so=他
tesaṃ=他們的
sā=彼
ta=彼
tassa=彼
tā=彼
te=彼等/汝
tena=由于
tāni=3rd
ti=」
ahampi=我也
tumha=你
tumhākaṃ=你們
tuvaṃ你
tvaṃ=你
taṃ=那
yasmiṃ=?
yassa=?
tatra=这
sudaṃ=的確
tattha=那里
tañca=?
vo=汝
vā=或
yañca=任何
yato=從那
yaṃ=哪
ye=哪
yo=哪
yā=哪一
ehi=來
tasmiṃ=於彼
tasmā=由此
ce=?`.split(/\r?\n/);
const lexicon_solo={};
solo.forEach(item=> {
	const at=item.indexOf("=");
	lexicon_solo[ item.substr(0,at)]=item.substr(at+1)
})

if (typeof window!=="undefined")
	window.lexicon_solo=lexicon_solo;
if (typeof module!=="undefined")module.exports=lexicon_solo;	