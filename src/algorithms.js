
let arr = []
let arrLength=100
let min = 3
let max = 1000
for (let i = 0;i<arrLength;i++)
{
    arr.push(Math.floor(Math.random() * (max - min + 1) + min  ))
}
console.log(arr)
let sorted = mergeSort(arr)
console.log(sorted)
function compare(a/*: number*/, b/*: number*/)/*: ['compare', number, number]*/ {
    console.log('compare called')
    return ['compare', a, b];
}
function swap(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['swap', a, b];
}

function moveForward(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['overwrite', a, b];
}

function set(a, num){
    return ['set', a, num];
}
function setMarker(a){
    return ['setMarker', a];
}
function compareToVal(a,num, numIdx){
    return ['compareVal', a, num, numIdx];
}


export function* bubbleSort(from, to) {
    let swapped;
    do {
        swapped = false;
        to -= 1; // decrement by 1 EACH loop, as we know the last element will be in place
        for (let j = from; j < to; j++) {
            if ((yield compare(j, j + 1)) > 0) {
                yield swap(j, j + 1);
                swapped = true;
            }
        }
    } while(swapped);
}

export function* insertionSort(from, to, arr){



    for(let i =1;i<to;i++)
    {
        let temp = yield setMarker(i)
        let j = i - 1
        while(j >= 0 && (yield compareToVal(j,temp, i)) > 0){
            console.log('j was more than I so mvoe j forward')
            yield moveForward(j, j+1 )
            j = j - 1
        }
        yield set(j+1, temp)
    }

}

function merge(left, right) {
    let arr = []
    console.log('merge called')
    // Break out of loop if any one of the array gets empty
    while (left.length && right.length) {
        // Pick the smaller among the smallest element of left and right sub arrays
        if (left[0] < right[0]) {
            arr.push(left.shift())
        } else {
            arr.push(right.shift())
        }
    }

    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [ ...arr, ...left, ...right ]
}

function mergeSort(array) {

    const half = array.length / 2

    // Base case or terminating case
    if(array.length < 2){
        return array
    }

    const left = array.splice(0, half)
    return merge(mergeSort(left),mergeSort(array))
}
