const bsearch=require("./bsearch");
const palihan=require("./palihan").split(/\r?\n/);

const bestlen=(w1,w2)=>{
	let l=0;
	for (var i=0;i<w1.length;i++) {
		if (w1[i]!==w2[i]) break;
		l++;
	}
	return l;
};
const getentry=i=>{
	const at=palihan[i].indexOf(",");
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
module.exports={breakword,getentry}