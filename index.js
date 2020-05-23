if (typeof require!='undefined') {
	bsearch=require("./bsearch");
	palihan=require("./palihan");	
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
const ENTRY_SEPARATOR=","
const getheadword=i=>{
	if (i>=palihan.length)return '';
	const at=palihan[i].indexOf(ENTRY_SEPARATOR);
	return palihan[i].substr(0,at);
}

const bestmatch=w=>{
	let at=bsearch(palihan,w,true);
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
const findCandidate=n=>{ 
	//[dictidx,len]
	const w=n[0],offset=n[1];
	let at=bsearch(palihan,w,true);

	let e=getheadword(at);
	const out=[];
	if (w==e) {
		out.push([at,offset,w.length]);
	}

	let len=0,blen=bestlen(w,e);
	let best=at;
	while (best>0) {
		best--;
		e=getheadword(best);
		
		len=bestlen(w,e);
		const r=len/e.length;

		//skip too short words
		if (len<4) break;

		//maximum declension length ==3
		if (len+3>=e.length)	out.push([best,offset,len])
		blen=len;
	}
	return out;
}
//move on ch forward, break sandhi 
const next=n=>{
	const w=n[0],offset=n[1];
	if (w[0]=="ā") {
		return ["a"+w.substr(1),offset];
	}
	return [w.substr(1),offset+1];
}

// ābcdefghi...
// abcdefghi...
//  bcdefghi...
//   cdefghi...
const listCandidate=w=>{
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

const ex={breakword,getheadword,getdef,listCandidate}
if (typeof module!=="undefined") {
	module.exports=	ex
}
if (typeof window!=="undefined"){
	window.paliword=ex
}