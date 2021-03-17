

function compare(a/*: number*/, b/*: number*/)/*: ['compare', number, number]*/ {
    console.log('compare called',a,' b: ',b)
    return ['compare', a, b];
}
/*function swap(a/!*: number*!/, b/!*: number*!/)/!*: ['swap', number, number]*!/ {
    return ['swap', a, b];
}*/

function colorFrom(start, end){
    return['colorRange', start, end]
}

function moveForward(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['overwrite', a, b];
}

/*function partition(start, end, arr){
    console.log('partition called')

    return ['partition', start, end]
}*/

function set(a, num){
    console.log('set called')
    return ['set', a, num];
}
function setMarker(a){
    return ['setMarker', a];
}
function compareToVal(a,num, numIdx){
    return ['compareVal', a, num, numIdx];
}

function overwriteSection(start, arr){
    return ['overwriteFrom', start, arr]
}

function* partition(items, left, right) {
    var pivot = items[Math.floor((right + left) / 2)]
    while (left <= right) {
        while (items[left] < pivot) { left++ }
        while (items[right] > pivot) { right-- }
        if (left <= right) {
            swap(items, left, right)
            left++
            right--
        }
        yield true
    }
    return left
}

function* generatorQuickSort(items, left, right) {
    var index
    if (items.length > 1) {
        left = typeof left !== "number" ? 0 : left
        right = typeof right !== "number" ? items.length - 1 : right
        index = yield* partition(items, left, right)
        if (left < index - 1) { yield* generatorQuickSort(items, left, index - 1) }
        if (index < right) { yield* generatorQuickSort(items, index, right) }
    }
    return items
}

function syncQuickSort(items) {
    let copy = items.slice()
    for (let operation of generatorQuickSort(copy));
    return copy;
}



function* quickSort(arr){

    console.log('quicksort was called ', arr ,'  ', )
    if(arr.length < 2){
        console.log('base case reached')
        return arr
    }
    let pivot = arr[0]
    let left = []
    let right = []
    let j=0
    let k = 0
    for(let i = 1; i < arr.length;i++){
        if(arr[i] < pivot){
            left.push(arr[i])

        }
        else{
            right.push(arr[i])

        }
    }
    console.log('left is: ',left,' right is: ',right)

    let sortedLeft = yield* quickSort(left)
    let sortedRight = yield* quickSort(right)
    let result = sortedLeft.concat(pivot)
    result = result.concat(sortedRight)
    yield result
    console.log(' after the recursion', result)
    return result
}

/*function* quickSort(start, end, arr ){


    console.log('quicksort was called ', arr ,' start ',start, ' end ', end )
    end = arr.length
    if(arr.length < 2){
        console.log('base case reached')
        return arr
    }

    let pivot = setMarker(end-1)
    pivot = arr[pivot[1]]
    console.log(pivot)
    let left = []
    let right = []
    let i
    let j = 0
    for(i = start; i < end-1;i++){
        if(pivot < arr[i]){
            // do nothing


        }
        else{

            yield swap(i, j)

            let temp = arr[j]
            arr[j] = arr[i]
            arr[i] = temp

            j++


        }
    }

    yield swap(j, end-1)

    console.log('arr before swap', arr)
    arr.splice(j, 0 , pivot)

   /!* let temp = arr[end-1]

    arr[end-1] = arr[j]



    arr[j] = temp
*!/
    console.log(' after sorting the array it is now ', arr)
    //todo I think this needs a partion function because this arr does not change
    left = arr.slice(0, j)// i would be the element before the pivot so we want to recursively sort everything i and before
    right = arr.slice(j+1, end)

    console.log('left is ', left , 'right is ', right)


    let sortedLeft = yield* quickSort(start, j, left )
    let sortedRight = yield* quickSort(start+j+1, end, right)

    console.log('sorted left is ', sortedLeft , 'sorted right is ', sortedRight)
    let result = sortedLeft.concat(pivot)
    result = result.concat(sortedRight)

    //yield overwriteSection(start, result)
    console.log(' after the recursion', result)
    return result
}*/
const swap = (arr, left, right) =>  {
    const temp = arr[left]
    arr[left] = arr[right]
    arr[right] = temp;
}

const partitionHigh = (arr, low, high) => {
    //Pick the first element as pivot
    let pivot = arr[high];
    let i = low;

    //Partition the array into two parts using the pivot
    for(let j = low; j < high; j++){
        if(arr[j] <= pivot){
            swap(arr, i, j);
            i++;
        }
    }

    swap(arr, i, high);

    //Return the pivot index
    return i;
}

const iterativeQuickSort = (arr) => {
    //Stack for storing start and end index
    let stack = [];

    //Get the start and end index
    let start = 0;
    let end = arr.length - 1;

    //Push start and end index in the stack
    stack.push({x: start, y: end});

    //Iterate the stack
    while(stack.length){
        //Get the start and end from the stack
        const { x, y } = stack.shift();

        //Partition the array along the pivot
        const PI = partitionHigh(arr, x, y);

        //Push sub array with less elements than pivot into the stack
        if(PI - 1 > x){
            stack.push({x: x, y: PI - 1});
        }

        //Push sub array with greater elements than pivot into the stack
        if(PI + 1 < y){
            stack.push({x: PI + 1, y: y});
        }
    }
}


let arr = [1,70,3,2,60,30]
let sorted = syncQuickSort(arr)
console.log(sorted)
//let sorted = iterativeQuickSort(arr)
console.log('does it work' ,arr)
let gen = quickSort(0, arr.length, arr)
console.log(gen)
let nextVal = gen.next()
while (nextVal.done !== true){
    nextVal = gen.next(nextVal)

}
console.log('first',gen.next())
console.log('last',gen.next())
/*console.log('first',gen.next())
console.log('second',gen.next())
console.log('third',gen.next())
console.log('four',gen.next())
console.log('5',gen.next())
console.log('6',gen.next())
console.log('7',gen.next())
console.log('8',gen.next())
console.log('9',gen.next())
console.log('10',gen.next())
console.log('11',gen.next())
console.log('12',gen.next())
console.log('13',gen.next())
console.log('13',gen.next())
console.log('13',gen.next())
/*


/*
ALL THIS IS AN OLD RECURSIVE ALGORITHM FOR MERGE SORT, ITS TOUGH TO YIELD FROM THOUGH
function* merge(start, Larr, Rarr) {
    //start should be the index in the main array where the two sorted subarrays start


    Larr = Larr.next().value
    Rarr = Rarr.next().value
    console.log('now the arrays to be merged are ', Larr, Rarr)
    // Break out of loop if any one of the array gets empty
    let tempArr = []
    let a = 0
    let b = 0
    let c = 0

    console.log('the indexes that are being overwritten are '+start+' to '+(start+Larr.length+Rarr.length))


    while (a < Larr.length  && b < Rarr.length) {
        if(Larr[a] < Rarr[b])
        {
            tempArr.push(Larr[a])
            a++
        }
        else{
            tempArr.push(Rarr[b])
            b++
        }

    }
    while(b< Rarr.length)
    {
        tempArr.push(Rarr[b])
        b++
    }

    while(a< Larr.length)
    {
        tempArr.push(Larr[a])
        a++
    }
    console.log('the array after merge is', tempArr)
    return tempArr
    // Pick the smaller among the smallest element of left and right sub arrays
    /!*
    if ((yield compare(Lstart, Rstart)) > 0) {
        yield set(Lstart, arr[Rstart] )
    } else {
        yield set(Lstart, arr[Lstart] )
    }
}

     *!/


}



function* mergeSort(start, end, arr) {
    console.log('the indexes are start: ' + start + ' end: ' + end)

    let middle = Math.floor((end + start) / 2)

    if (end - start < 2) {
        let baseCaseArr = arr.slice(start, end)
        console.log('we reached the base case, This already feels like a success heres what we return', baseCaseArr)
        return arr.slice(start, end)
    }


    let result = yield* merge(start, mergeSort(start, middle, arr), mergeSort(middle, end, arr))
    console.log('the result from merge is',result)
    return result
}

let arr = [1,5,3,2, 6]
let gen = mergeSort(0,arr.length,arr)

console.log(gen.next())*/

/*
this is one way of doing quicksort but its harder to show swapping so I changed it to a different version of quicksort( more in place
export function* quickSort(start, end,arr, ){


    console.log('quicksort was called ', arr ,' start ',start )
    if(arr.length < 2){
        console.log('base case reached')
        return arr
    }
    let pivot = arr[0]
    yield setMarker(start)
    let left = []
    let right = []
    let j=0
    let k = 0
    for(let i = 1; i < arr.length;i++){
        if(arr[i] < pivot){
            left.push(arr[i])

        }
        else{
            right.push(arr[i])

        }
    }
    console.log('left is: ',left,' right is: ',right)

    let sortedLeft = yield* quickSort(start, end, left)
    let sortedRight = yield* quickSort(sortedLeft.length + 1, end, right)
    let result = sortedLeft.concat(pivot)
    result = result.concat(sortedRight)
    yield overwriteSection(start, result)
    console.log(' after the recursion', result)
    return result
}*/


