const {breakword,getentry}=require("./index");
const testdata=[
["ucchādana","ucchādana"]
,["aniccucchādanaparimaddanabhedana","anicc-ucchādana-parimaddana-bhedana"]
,["paṭhamanayabhūmipariccheda",'paṭhama-naya-bhūmi-pariccheda']
,["parikkhīṇabhavasaṃyojana",'parikkhīṇa-bhavasaṃyojana']
//字典加 aṭṭhama
,["aṭṭhamanayabhūmipariccheda",'aṭṭhama-naya-bhūmi-pariccheda']

,["nāttaparitāpanānuyogamanuyutto","na-atta-paritāpana-anuyoga-m-anuyutto"]
,["bhikkhusaṅghena","bhikkhu-saṅghena"]
]
let passed=0,failed=0;
testdata.forEach(w=>{
	const o=breakword(w[0]);
	const s=o.map(w=>w[1]).join("-");

	if (s!==w[1]) {
		console.log(s,'expected',w[1])
		failed++;
	} else {
		passed++;
	}
})

console.log("passed",passed,"failed",failed);