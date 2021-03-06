'use strict';
/*
  binary search an sorted int or string array
  sort function
   (a,b)=>(a==b)?0:((a>b)?1:-1)
*/
var indexOfSorted = function (array, obj, near) {
  var low = 0, high = array.length, mid;
  while (low < high) {
    mid = (low + high) >> 1;
    if (array[mid] === obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low] === obj) return low;else return -1;
};
var indexOfSorted_str = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]===obj) return mid;
    //(array[mid].localeCompare(obj)<0) ? low = mid + 1 : high = mid;
    array[mid]<obj ? low=mid+1 : high=mid;
    //console.log( "mid",array[mid],"low",array[low]);
  }
  if (near) return low;
  else if (array[low]===obj) return low;else return -1;
};


var bsearch=function(array,value,near) {
	var func=indexOfSorted;
	if (typeof array[0]=="string") func=indexOfSorted_str;
	return func(array,value,near);
}

if (typeof module!=="undefined") {
  module.exports= bsearch;
}
if (typeof window!=="undefined"){
  window.bsearch=bsearch;
}