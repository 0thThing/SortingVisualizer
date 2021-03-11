



function* mergeSort(start, end, arr) {
    console.log('the indexes are start: ' + start + ' end: ' + end)

    let middle = Math.floor((end + start) / 2)

    if (end - start < 2) {
        let baseCaseArr = arr.slice(start, end)
        console.log('we reached the base case, This already feels like a success heres what we return', baseCaseArr)
        return arr.slice(start, end)
    }


    let left = yield* mergeSort(start, middle, arr)
    let right = yield* mergeSort(middle, end, arr)
    console.log(left)

    //left = left.next().value
    //right = right.next().value
    console.log(left)

    yield left
    yield right

    //console.log('now the arrays to be merged are ', left, right)
    // Break out of loop if any one of the array gets empty
    let tempArr = []
    let a = 0
    let b = 0
    let c = 0


    while (a < left.length  && b < right.length) {
        if(left[a] < right[b])
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
    console.log('the array after merge is', tempArr)
    return tempArr

    return tempArr
}

let arr = [1,5,3,2, 6]
let gen = mergeSort(0,arr.length,arr)

console.log('first',gen.next())
console.log('second',gen.next())
console.log('third',gen.next())
console.log('four',gen.next())
console.log('5',gen.next())
console.log('6',gen.next())
console.log('7',gen.next())
console.log('8',gen.next())
console.log('9',gen.next())

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


