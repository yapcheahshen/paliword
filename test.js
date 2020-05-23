const {breakword,getheadword,listCandidate}=require("./index");
const testdata=[
//["ucchādana","ucchādana"]
//,["aniccucchādanaparimaddanabhedana","anicc-ucchādana-parimaddana-bhedana"]
//,["paṭhamanayabhūmipariccheda",'paṭhama-naya-bhūmi-pariccheda']
//,["parikkhīṇabhavasaṃyojana",'parikkhīṇa-bhavasaṃyojana']
//字典加 aṭṭhama
//,["aṭṭhamanayabhūmipariccheda",'aṭṭhama-naya-bhūmi-pariccheda']
,["nāttaparitāpanānuyogamanuyutto","na-atta-paritāpana-anuyoga-m-anuyutto"]
//,["bhikkhusaṅghena","bhikkhu-saṅghena"]
]
let passed=0,failed=0;

const testbreakword=D=>{
	D.forEach(w=>{
		const o=breakword(w[0]);
		const s=o.map(w=>w[1]).join("-");

		if (s!==w[1]) {
			console.log(s,'expected',w[1])
			failed++;
		} else {
			passed++;
		}
	})
	console.log("breakword passed",passed,"failed",failed);
}

const testlistCandidate=D=>{
	D.forEach(d=>{
		const o=listCandidate(d[0]);
		const entries=o.map(item=>[getheadword(item[0]),item[1]]);
		entries.sort((a,b)=>b[1]-a[1])
		console.log(d[0]);
		console.log(entries.join("\n"))
	})
}
testlistCandidate(testdata)



