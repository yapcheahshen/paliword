if (typeof require!='undefined') {
	bsearch=require("./bsearch");
	//palilexicon from global, big file do not pack in bundle
	lexicon_solo=require("./lexicon-solo");
}


const bestlen=(w1,w2)=>{
	let l=0;
	for (var i=0;i<w1.length;i++) {
		if (w1[i]!==w2[i]) break;
		l++;
	}
	return l;
};
//get the defination give dictionary line index or entry
const getdef=i=>{
	if (typeof i=="string") {
		at=bsearch(palihan,i);
		return (at>-1)?palihan[at]:'';
	}
	return palihan[i];
}
//get the headword of dictionary
const ENTRY_SEPARATOR="="
const getheadword=i=>{
	if (i>=palilexicon.length)return '';
	const at=palilexicon[i].indexOf(ENTRY_SEPARATOR);
	return palilexicon[i].substr(0,at);
}

const bestmatch=w=>{
	let at=bsearch(palilexicon,w,true);
	let e=getentry(at);
	if (w==e) {
		return {at,len:w.length};
	}

	let len=0,blen=bestlen(w,e);
	let best=at;
	while (best>0) {
		best--;
		e=getentry(best);
		len=bestlen(w,e);
		if (len<blen) {
			best++
			break;
		}
		blen=len;
	}
	return {at:best,len:blen};
}
const breakword=w=>{
	let o,out=[];
	let remain=w;

	while (remain.length) {
		//todo,
		//try stem if not found
		o=bestmatch(remain);
		if (o.len==0) {
			out.push([-1,remain]);
			break;
		}
		out.push([o.at,remain.substr(0,o.len)]);
		remain=remain.substr(o.len);
	}
	return out;
}

//jump to the closest match, and move around to find possible match
//output : array of 
//         [dictionary_line_index, offset_in_compoundword, matched_character_count]

const ends=['a','i','u','ā','ī','ū'];

const matchend=(w,entry)=>{
	for (var i=0;i<ends.length;i++){
		if (w+ends[i]==entry) {
			return true;
		}
	}
	return false;
}
/*
const suffix=[
[/issa$/,'i'],
[/tabba$/,'a'],
[/eyyaṃ$/,'a'],
[/eyyam$/,'a'],
[/eyyasi$/,'a'],
[/eyya$/,'a'],
[/esu$/,'a'],
[/itvā$/,'ati'],
[/ituṃ$/,'ati'],
[/tvā$/,'ti'],
[/etvā$/,'ati'],
[/etha$/,'ati'],
[/iṃsu$/,'ati'],
[/assa$/,'a'],
[/assa$/,'i'],
[/nta$/,'nti'],
[/ehi$/,'a'],
[/āya$/,'a'],
[/ayo$/,'i'],
[/āna$/,'a'],
[/ānaṃ$/,'a'],
[/smiṃ$/,''],
[/ūnaṃ$/,'u'],
[/mi$/,'ti'],
[/si$/,'ti'],
[/aṃ$/,'i'],
[/o$/,'a'],
[/e$/,'a'],
[/e$/,'u'],//hete hetu
[/ā$/,'a'],
[/ī$/,'i'],
[/ū$/,'u'],
[/ṃ$/,'']
]*/

const suffix=[
[/ssa$/,''],
[/tabba$/,''],
[/eyyaṃ$/,''],
[/eyyam$/,''],
[/eyyasi$/,''],
[/eyya$/,''],
[/esu$/,''],
[/tuṃ$/,''],
[/tvā$/,''],
[/etvā$/,''],
[/etha$/,''],
[/ṃsu$/,''],
[/nta$/,''],
[/ehi$/,''],
[/ena$/,''],
[/āya$/,''],
[/ayo$/,''],
[/āna$/,''],
[/anaṃ$/,''],
[/ānaṃ$/,''],
[/naṃ$/,''],
[/smiṃ$/,''],
[/ūnaṃ$/,''],
[/mi$/,'t'],
[/si$/,'t'],
[/aṃ$/,''],
[/[aāeiīūou]?$/,''],
[/ṃ$/,'']
];
const stem=w=>{
	let s=w;
	for (var i=0;i<suffix.length;i++){
		n=s.replace(suffix[i][0],suffix[i][1]);
		if (n!==w && s.length>=3){
			return n;
		}
	}
	return w;
}
const findCandidate=n=>{ 
	//[dictidx,len]


	const w=n[0],offset=n[1];
	let at=bsearch(palilexicon,w,true);

	let e=getheadword(at);
	const out=[];
	if (w==e) {
		out.push([at,offset,w.length]);
	}


	let len=0,blen=bestlen(w,e);
	let best=at;
	let b2=best>0?bestlen(w,getheadword(best-1)):blen;//problem in bsearch
	if (b2>blen){
		blen=b2;
		best--;
	}
	while (best>0) {
		e=getheadword(best);	
		len=bestlen(w,e);
		const r=len/e.length;

		//skip too short words
		if (len<3) break;

		//maximum declension length ==3
		//if (len+3>=e.length) out.push([best,offset,len])
		if (len==e.length) {
		  out.push([best,offset,len])//full match
		} else if (stem(w)==stem(e)) {
			out.push([best,offset,w.length]); //stem match
		} else if (matchend(w.substr(0,len),e)){
			out.push([best,offset,len]); //"anicc"u ==> anicca
		}

		blen=len;
		best--;
	}
	return out;
}


// ābcdefghi...
// abcdefghi...
//  bcdefghi...
//   cdefghi...
const listCandidate=w=>{
	//move on ch forward, break sandhi 
	w=w.toLowerCase();
	const next=n=>{
		const w=n[0],offset=n[1];
		if (w[0]=="ā") {
			return ["a"+w.substr(1),offset];
		}
		return [w.substr(1),offset+1];
	}
	let out=[];
	let n=[w,0];
	while (n[0].length>2) {
		out=out.concat(findCandidate(n));
		n=next(n);
	}

	for (var i=0;i<out.length;i++) {
		out[i][3]=i; //keep the array index, easy access after Array.filter
	}
	
	return out
}
const bestRoute=(w,candidates)=>{
	const dag=[]; //direct acyclic graph, 儲存所有分支
	for (var i=0;i<candidates.length;i++) {
		const offset=candidates[i][1];
		if (!dag[offset]) dag[offset]=[];
		dag[offset].push(i);
	}

	const route=[]; // [ncandidate , nfrag ] 第n個詞,到末端的最少碎片數
	let nfragment, best;

	for (var i=0;i<w.length;i++) route[i]=[-1,0]; //-1 表示無詞

	for (var off=w.length-1;off>=0;off--) {
		//從off到終點碎片數。
		nfragment=1;
		best=-1;
		//下一字元的碎片數，加上這個字元算一個碎片
		if (off<w.length-1) nfragment=1+route[off+1][1];

		if (!dag[off]){ //沒有以此開頭的詞。
			route[off]=[-1,nfragment];
			continue;
		}

		//找出碎片數最小的分支
		for (let xi=0;xi<dag[off].length;xi++) {
			const ncandidate=dag[off][xi];
			let candidate = candidates[ncandidate];
			let endoffset=candidate[1];
			let candidatelen=candidate[2];

			let nfrag;
			if (route[endoffset]) {
				if (endoffset+candidatelen<w.length){
					nfrag=1+route[endoffset+candidatelen][1];
				} else {
					nfrag=1;
				}
			}
			if (nfragment>nfrag){
				best=ncandidate;
				nfragment=nfrag;
			}
		}
		route[off] = [best,nfragment];
	}
	return route;
}
const suggestedBreak=(w,candidates)=>{
	if (lexicon_solo[w]){
		return [[w,lexicon_solo[w]]];
	}

	let owncand=false;
	if (typeof candidates=="undefined"){
		candidates=listCandidate(w);
		owncand=true;
	}
	const route=bestRoute(w,candidates);
	let out=[];
	let s='',i=0,breaker='';
	while (i<w.length){
		const n=route[i][0];
		if (!candidates[n] || route[i][1]==-1) {
			s+=w.substr(i,1);
			breaker='';
			i++;
			continue;
		}
		const offset=candidates[n][1]+candidates[n][2];

		if (s) out.push([s,-1]);s='';
		out.push([w.substring(i, offset ),owncand?candidates[n]:n]);
		i=offset;
		if (n+1>=candidates.length)break;
	}
	s+=w.substr(i);
	for (var j=0;j<suffix.length&&s.length&&out.length;j++){
		const m=s.match(suffix[j][0]);
		if (m==s){ //dirty hack
			const b=out[out.length-1];
			b[0]+=s;
			b[1][2]+=s.length;
			return out;	
		}
	}

	if (s)out.push([s,-1]);	
	return out;
}
const ex={breakword,getheadword,getdef,listCandidate,suggestedBreak}
if (typeof module!=="undefined") {
	module.exports=	ex
}
if (typeof window!=="undefined"){
	window.paliword=ex
}