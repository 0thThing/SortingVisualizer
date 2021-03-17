
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

    return ['compare', a, b];
}
function swap(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {

    return ['swap', a, b];
}

function setMarker(a){
    return ['setMarker', a];
}

function overwriteSection(start, arr){
    return ['overwriteFrom', start, arr]
}
function insertPivot(idx, pivot){
    return ['insert', idx, pivot]
}

function partition(start, end){
    console.log('partition called')

    return ['partition', start, end]
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
        while(j >= 0 && (yield compare(j,j+1)) > 0){
            console.log('j was more than I so mvoe j forward')
            yield swap(j, j+1 )
            j = j - 1
        }

    }

}


export function* quickSort(start, end, arr ){

    console.log('quicksort was called ', arr ,' start ',start, ' end ', end )
    let pivot = yield setMarker(end-1)
    if((end-start) < 2){
        console.log('base case reached')
        return arr
    }



    console.log('whats the pivot', pivot)
    console.log(pivot)
    let left = []
    let right = []
    let i
    let j = -1
    for(i = start; i < end-1;i++){
        if((yield compare(i , end-1)) > 0){
            // do nothing


        }
        else{
            j++
            yield swap(i,start + j)

           let temp = arr[j]
            arr[j] = arr[i]
            arr[i] = temp

        }
    }




    console.log('arr before swap', arr)
    ++j
    // wow I found the j++ and ++j bug here instantly, proud of that moment
    yield swap(start+j, end-1)
    let temp = arr[j]
    arr[j] = arr[i]
    arr[i] = temp


    console.log(' after sorting the array it is now ', arr)
    //todo I think this needs a partion function because this arr does not change

    left  = yield partition(start, j)// i would be the element before the pivot so we want to recursively sort everything i and before
    let sortedLeft = yield* quickSort(start, j, left )
    right = yield partition(start + j+1, end)
    console.log('left is ', left , 'right is ', right)
    console.log('%cthe value of end is: ','color: red', end)
    let sortedRight = yield* quickSort(start+j+1, end, right)

    console.log('sorted left is ', sortedLeft , 'sorted right is ', sortedRight)
    let result = sortedLeft.concat(pivot)
    //insertPivot(j, pivot)
    result = result.concat(sortedRight)

    //yield overwriteSection(start, result)
    console.log(' after the recursion', result)
    return result
}
/*
export function* quickSort(start, end, arr ){


    console.log('quicksort was called ', arr ,' start ',start, ' end ', end )

    if(arr.length < 2){
        console.log('base case reached')
        return arr
    }

    //yield setMarker(end)
    let left = []
    let right = []
    let i
    let j = 0
    for(i = start; i < end-1;i++){
        if((yield compare(i , end-1)) > 0){
            // do nothing
            console.log('we never call this')

        }
        else{

            yield swap(i, j)
            j++


        }
    }
    yield swap(j, end-1)

    left = arr.slice(start, j)// i would be the element before the pivot so we want to recursively sort everything i and before
    right = arr.slice(start + j, end)

    console.log('left is ', left , 'right is ', right)


    let sortedLeft = yield* quickSort(start, j, left )
    let sortedRight = yield* quickSort(start+j, end, right)

    console.log('sorted left is ', sortedLeft , 'sorted right is ', sortedRight)
    let result = sortedLeft.concat(sortedRight)


    console.log(' after the recursion', result)
    return result
}*/



export function* mergeSort(start, end, arr) {
    console.log(' does this array ever change? ', arr)
    //console.log('the indexes are start: ' + start + ' end: ' + end)

    let middle = Math.floor((end + start) / 2)

    if (end - start < 2) {
        let baseCaseArr = arr.slice(start, end)
        //console.log('we reached the base case, This already feels like a success heres what we return', baseCaseArr)
        return arr.slice(start, end)
    }


    let left = yield* mergeSort(start, middle, arr)
    let right = yield* mergeSort(middle, end, arr)
    console.log(left)


    //left = left.next().value
    //right = right.next().value
    console.log(left)

    //yield overwriteSection(start, left)
    //yield overwriteSection(start, right)

    //console.log('now the arrays to be merged are ', left, right)

    let tempArr = []
    let a = 0
    let b = 0
    let c = 0


    while (a < left.length  && b < right.length) {

        if((yield compare(start + a , start + left.length +b)) < 1)
        //
        {
            tempArr.push(left[a])
            a++
        }
        else{
            tempArr.push(right[b])
            b++
        }

    }
    while(b< right.length)
    {
        tempArr.push(right[b])
        b++
    }

    while(a< left.length)
    {
        tempArr.push(left[a])
        a++
    }
    yield overwriteSection(start, tempArr)
    return tempArr


}

