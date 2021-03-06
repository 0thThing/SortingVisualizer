import React,{ useState, useReducer, useEffect, useRef, useCallback } from 'react'
import '../App.css'
// Sorting things
function compare(a/*: number*/, b/*: number*/)/*: ['compare', number, number]*/ {
    return ['compare', a, b];
}
function swap(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['swap', a, b];
}

function* bubbleSort(from/*: number*/, to/*: number*/)/*: Generator<['swap' | 'compare', number, number], void, number> */ {
    let swapped/*: boolean */;
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



function useSortingVisualizer(baseArray, algorithm){
    const [displayedArray, setArray] = useState/*<number[]>*/([]);
    const [done, setDone] = useState(true);
    const [resetCount, reset] = useReducer(0, (state) => state + 1);
    const [barEffects, setBarEffects] = useState/*<Record<number, string>>*/({})
    const stepRef = useRef(() => {});
    useEffect(() => {
        let workingArray = baseArray;
        setArray(workingArray);
        setBarEffects({});
        setDone(false);
        const generator = algorithm(0, baseArray.length);
        let nextValue = 0;
        function doStep() {
            const action = generator.next(nextValue);
            console.log(action)
            if (action.done) {
                setDone(true);
            } else if (action.value[0] === 'compare') {
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
            } else if (action.value[0] === 'swap') {
                workingArray = [...workingArray]
                const tmp = workingArray[action.value[1]];
                workingArray[action.value[1]] = workingArray[action.value[2]];
                workingArray[action.value[2]] = tmp;
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'green',
                    [action.value[2]]: 'green',
                })
            } else {
                throw new Error('What? ' + JSON.stringify(action.value));
            }
        }
        stepRef.current = doStep;
    }, [resetCount, baseArray, algorithm])

    const step = useCallback(() => {
        stepRef.current();
    }, [stepRef]);
    return {
        displayedArray,
        done,
        step,
        reset,
        barEffects,
    }
}

// End sorting things



function makeArray(length) {
    const array = [];
    for(let i = 0; i < length; i++) {
        array.push(i);
    }
    array.sort(() => Math.random() < 0.5 ? 1 : -1);
    array.sort(() => Math.random() < 0.5 ? 1 : -1);
    return array;
}

const BAR_WIDTH = 12;

function Test () {
    const [baseArray, setArray] = useState(makeArray(20));
    const [algorithm, setAlgorithm] = useState(() => bubbleSort);
    const {
        displayedArray,
        done,
        step,
        reset,
        barEffects,
    } = useSortingVisualizer(baseArray, algorithm);
    const [playing, setPlay] = useState(false);
    useEffect(() => {
        if(!done && playing) {
            let taskId = window.setInterval(() => {
                step();
            }, 1000 / 30)
            return () => window.clearInterval(taskId);
        }
    }, [done, step, playing])
    return(
        <div className="container">
            <h1>Sorting example</h1>
            <div className="array">
                {displayedArray.map((value, index) => (
                    <div
                        key={value}
                        className="bar"
                        style={{
                            left: index * BAR_WIDTH,
                            width: BAR_WIDTH,
                            bottom: 0,
                            height: `${(value + 1) / displayedArray.length * 100}%`,
                            backgroundColor: barEffects[index],
                        }}
                        title={`Value: ${value}`}
                    ></div>
                ))}
            </div>
            <div>
                <h2> Controls: </h2>
                <button onClick={() => setArray(makeArray(20))}>Random array</button>
                <h3>Timeline control</h3>
                <button onClick={step}>Single step</button>
                <button onClick={reset}>Reset</button>
                <button onClick={() => setPlay(playing => !playing)}>{playing ? 'Pause autoplay' : 'Autoplay'}</button>
            </div>
        </div>
    );
}
export default Test


