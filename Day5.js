var t   = document.body.innerText;
var arr = t.split("\n");
delete arr [arr.length - 1];

function getJumpFrom (arr, index){
	arr [index] = parseInt(arr[index]);
	var jump = arr [index];
	if (jump >= 3)
		arr [index] --;
	else
		arr [index] ++;
	return jump;
}

function jumps (arr) {
	var index = 0;
	var count = 0;
	while (index >= 0 && index < arr.length){
		index += getJumpFrom (arr, index);
		count++;
	}
	return count - 1;
}

console.log (jumps (arr));
