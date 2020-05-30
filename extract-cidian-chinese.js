const fs=require("fs")
const set="F",pat=/\[(.*?)\.?\]/g; //F%巴漢詞典
//const set="R", pat=/\((.*?)\)/g
const extract=()=>{

	const cidian=fs.readFileSync("./cidian.txt","utf8").split(/\r?\n/);

	console.log("loaded")
	const ccped=[];
	for (var i=0;i<cidian.length;i++){
		if (cidian[i][0]==set) {
			var w=cidian[i].substr(2);
			w=w.replace(/ṁ/g,"ṃ");
			const items=w.split(/,/);
			items[0]=items[0].toLowerCase();
			ccped.push( items.join("="));
		}
	}
	//remove repeated
	const out=[];
	let last='';
	for (var i=0;i<ccped.length;i++) {
		if (ccped[i]!==last) out.push(ccped[i]);
		last=ccped[i];
	}
	out.sort((a,b)=>(a==b)?0:((a>b)?1:-1));
	
	console.log("output palihan.js repeat entries:",ccped.length-out.length)

	const exportto='if (typeof window!="undefined")window.palilexicon=palihan;else module.export=palihan;'
	fs.writeFileSync("palihan.js",
		"const palihan=`"+out.join("\n")+"`.split(/\\r?\\n/).sort((a,b)=>(a==b)?0:((a>b)?1:-1));\n"+exportto,"utf8");
}

extract()