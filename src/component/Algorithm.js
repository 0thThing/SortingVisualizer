import React,{ useState, useReducer, useEffect, useRef, useCallback } from 'react'
import Bar from './Bar'
import Header from "./Header";
import {bubbleSort, insertionSort, mergeSort, quickSort } from "../algorithms";

function compare(a/*: number*/, b/*: number*/)/*: ['compare', number, number]*/ {
    console.log('compare called',a,' b: ',b)
    return ['compare', a, b];
}
function swap(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['swap', a, b];
}

function colorFrom(start, end){
    return['colorRange', start, end]
}

function moveForward(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['overwrite', a, b];
}

function partition(start, end, arr){
    console.log('partition called')
    mergeSort(start,end ,arr)
    return ['partition', start, end]
}

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

/*
todo        feeling like using this implementation of generator mergesort makes it impossible to animate since the functions to animalte in useSortingVisualizer
todo        automatically give their return to each other in a deep recursive loop when the animations need to go to the caller halfway through the recursion


 */
/*
function* mergeSort(start, end, arr) {
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
        //if(left[a]< right[b])
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
*/


function useSortingVisualizer(baseArray, algorithm){
    const [displayedArray, setArray] = useState([]);
    const [done, setDone] = useState(true);
    const [barEffects, setBarEffects] = useState({})
    const stepRef = useRef(() => {});
    useEffect(() => {
        console.log('use sorting visualizer useEffect, I think this is called only once when the component first renders')
        let workingArray = baseArray;
        setArray(workingArray);
        setBarEffects({});
        setDone(false);
        console.log('here is the algorithm' , algorithm)

        const generator = algorithm(0, baseArray.length, workingArray);
        console.log(baseArray.length)
        let nextValue = 0;
        function doStep() {
            const action = generator.next(nextValue);
            console.log('we have received this from the generator ',action, 'is the value an array , ',Array.isArray(action.value))
            if (action.done) {
                console.log('the generator is done')
                setDone(true);
            } else if (action.value[0] === 'compare') {
                console.log(' we have these values sent to compare ', action.value)
                const a = workingArray[action.value[1]];
                const b = workingArray[action.value[2]];
                if(a > b) {
                    nextValue = 1;
                } else if (a < b) {
                    nextValue = -1;
                } else {
                    nextValue = 0;
                }
                setBarEffects({
                    [action.value[1]]: 'red',
                    [action.value[2]]: 'red',
                })
            }
            else if (action.value[0] === 'insert') {
                workingArray = [...workingArray]
                workingArray.splice(action.value[1], 0 , action.value[2])

                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'green',

                })
            }
            else if (action.value[0] === 'swap') {
                workingArray = [...workingArray]
                const tmp = workingArray[action.value[1]];
                workingArray[action.value[1]] = workingArray[action.value[2]];
                workingArray[action.value[2]] = tmp;
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'green',
                    [action.value[2]]: 'green',
                })
            } else if(action.value[0] === 'overwrite') {
                workingArray = [...workingArray]
                workingArray[action.value[2]] = workingArray[action.value[1]];
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'green',
                    [action.value[2]]: 'green',
                })
            }
            else if(action.value[0] === 'overwriteFrom') {
                workingArray = [...workingArray]
                let arr = action.value[2]
                let j = 0
                let start = action.value[1]
                for (let i = action.value[1]; i < action.value[2].length + action.value[1]; i++)
                {
                    workingArray[i] = arr[j]
                    j++
                }
                setArray(workingArray);

            }
            else if(action.value[0] === 'set') {
                workingArray = [...workingArray]
                workingArray[action.value[1]] = action.value[2];
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'blue',
                    [action.value[2]]: 'blue',
                })
            }
            else if(action.value[0] === 'setMarker') {
                workingArray = [...workingArray]
                nextValue = workingArray[action.value[1]]
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'blue',

                })
            }
            else if(action.value[0] === 'colorRange') {
                workingArray = [...workingArray]
                setArray(workingArray);
                for(let i = action.value[1]; i<action.value[2]; i++) {
                    setBarEffects({
                        [action.value[i]]: 'blue',

                    })
                }
            }

            else if(action.value[0] === 'overwriteFrom') {
                console.log('has this been called at all', action.value[2], action.value[1])
                workingArray = [...workingArray]
                let start = action.value[1]
                setArray(workingArray);
                for(let i = start; i<action.value[2].length+start; i++) {
                    setBarEffects({
                        [action.value[i]]: 'blue',

                    })
                }
            }

            else if(action.value[0] === 'partition') {
                workingArray = [...workingArray]
                nextValue = workingArray.slice(action.value[1], action.value[2] )
                console.log("%cthe value being passed back is " ,"color: green", nextValue)
                setBarEffects({
                    [action.value[1]]: 'blue',
                    [action.value[2]-1]: 'blue',
                })
            }
            else if(action.value[0] === 'compareVal') {
                //crucial difference is b isnt taken from index here
                //also had to use a fourth argument which is the index that the temp value was originally from
                const a = workingArray[action.value[1]];
                const b = action.value[2];
                if(a > b) {
                    nextValue = 1;
                } else if (a < b) {
                    nextValue = -1;
                } else {
                    nextValue = 0;
                }
                setBarEffects({
                    [action.value[1]]: 'red',
                    [action.value[3]]: 'red',
                })
            }
            else {
                throw new Error('What? ' + JSON.stringify(action.value));
            }

        }
        stepRef.current = doStep;
    }, [baseArray, algorithm])

    const step = useCallback(() => {
        stepRef.current();
    }, [stepRef]);
    return {
        displayedArray,
        done,
        step,
        barEffects,
    }
}


function makeArray(length,minVal, maxVal) {
    const array = [];
    for(let i = 0; i < length; i++) {
        array.push(Math.floor(Math.random() * (maxVal - minVal + 1) + minVal  ))
    }
    return array;
}

function Algorithm(props){
    let min = 3


    let max = 1000
    let arrLength = 10

    const [arr, setArr] = useState(makeArray(arrLength, min, max))
    const algorithm = useRef( bubbleSort);


    const {
        displayedArray,
        done,
        step,
        barEffects,
    } = useSortingVisualizer(arr, algorithm.current);

    const [playing, setPlay] = useState(false);
    useEffect(() => {
        if(!done && playing) {
            let taskId = window.setInterval(() => {
                step();
            }, 0.01)
            return () => window.clearInterval(taskId);
        }
    }, [done, step, playing, algorithm])




    let bars = displayedArray.map((num,idx) => {
        //not the best way to set the bar height but dividing by 10 here is just so the largest number(1000) fits as 100% of the parent container
        let barHeight = num/10+'%'

        return (
                <div key={idx} className='array-bar' style={{backgroundColor: barEffects[idx] ,height: barHeight, bottom: '0', marginRight: '1px'}}>
                    {num}
                </div>
            )

    })







    return (
        <>
            <nav style={{margin: '0 auto', width: '100%', justifyContent: 'center'}}className="navbar navbar-light bg-light navbar-expand-sm">

                    <button onClick={(e) => algorithm.current = insertionSort} className="btn btn-outline-success m-1" type="button">insertion sort</button>
                    <button onClick={(e) => algorithm.current =bubbleSort} className="btn btn-outline-success m-1" type="button">bubble sort</button>
                    <button onClick={(e) => algorithm.current =mergeSort} className="btn btn-outline-success m-1" type="button">merge sort</button>
                <button onClick={(e) => algorithm.current = quickSort} className="btn btn-outline-success m-1" type="button">quick sort</button>

            </nav>
            <div className='array-container'>

                {bars}

            </div>
            <div className='align-items-center justify-content-center flex' style={{display: 'flex'}}>
                <button className="btn btn-outline-primary mx-4 my-2" onClick={() => setArr(makeArray(100, 2, 1000))}>Randomize Array</button>
                <button className="btn btn-outline-primary mx-4 my-2" onClick={step}>Single Step</button>

                <button className="btn btn-outline-primary mx-4 my-2" onClick={() => setPlay(playing => !playing)}>{playing ? 'Pause autoplay' : 'Autoplay'}</button>
            </div>
        </>
    )
}
export default Algorithm



