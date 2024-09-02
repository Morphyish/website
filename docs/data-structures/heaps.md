# Heaps (priority queues)

### Complete Binary Tree
Each level of a Complete Binary Tree contains the maximum number of nodes, except possibly the last layer, which must be filled from left to right.

### Heap property

Heap property essentially means that for any given node C, if P is a parent node of C, then:

- For a max heap: the key of P should be greater than or equal to the key of C.
- For a min heap: the key of P should be less than or equal to the key of C.

### Heaps are stored as arrays

If a node is placed at index i in array, then given that the resultant index lies within length of the array:
- Left child would be at (2i+1)th position
- Right child would be at (2i+2)the position

If a node is placed at index i in array, it's parent node would be located at floor((i-1)/2)th index.

## Implementation (Min Heap)

### heappush

adds the provided newKey into the min-heap named "heap"

```ts
function heappush(heap, newKey){
  // push the new key 
  heap.push(newKey);

  // get the current index of pushed key
  let curr = heap.length-1;

 // keep comparing till root is reached or we terminate in middle
  while(curr > 0){
    let parent = Math.floor((curr-1)/2)
    if( heap[curr] < heap[parent] ){
      // quick swap
      [ heap[curr], heap[parent] ] = [ heap[parent], heap[curr] ]
      // update the index of newKey
      curr = parent
    } else{
      // if no swap, break, since we heap is stable now
      break
    }
  } 
}
```

### heappop

removes the smallest key from the min-heap named "heap"

```ts
function heappop(heap){
  // swap root with last node
  const n = heap.length;
  [heap[0], heap[n-1]] = [ heap[n-1], heap[0]]

  // remove the root i.e. the last item (because of swap)
  const removedKey = heap.pop();

  let curr = 0;

  // keep going till atleast left child is possible for current node
  while(2*curr + 1 < heap.length){
    const leftIndex = 2*curr+1; 
    const rightIndex = 2*curr+2;
    const minChildIndex = (rightIndex < heap.length && heap[rightIndex] < heap[leftIndex] ) ? rightIndex :leftIndex;
    if(heap[minChildIndex] < heap[curr]){
     // quick swap, if smaller of two children is smaller than the parent (min-heap)
      [heap[minChildIndex], heap[curr]] = [heap[curr], heap[minChildIndex]]
      curr = minChildIndex
    } else {
      break
    }
  }

  // finally return the removed key
  return removedKey;
}
```

### heapify

transforms a pre-existing array into a heap

```ts
function percolateDown(heap, index) {
  let curr = index;
  // keep going down till heap property is established
  while (2 * curr + 1 < heap.length) {
    const leftIndex = 2 * curr + 1;
    const rightIndex = 2 * curr + 2;
    const minChildIndex = (rightIndex < heap.length && heap[rightIndex] < heap[leftIndex]) ? rightIndex : leftIndex;
    if (heap[minChildIndex] < heap[curr]) {
      // quick swap, if smaller of two children is smaller than the parent (min-heap)
      [heap[minChildIndex], heap[curr]] = [heap[curr], heap[minChildIndex]]
      curr = minChildIndex
    } else {
      break
    }
  }
}

function heapify(heap){
  const last = Math.floor(heap.length/2 - 1);
  for(let i = 0; i <= last; i++){
    percolateDown(heap, i)
  }
  return heap
}
```

## How to make it into a Max Heap

Max heap is a min heap using negative keys.

Say we have an array `const x = [23, 454, 54, 29]`

```ts
const minHeap = [];
for(let el of x) heappush(minHeap, el);

// min value
const min = heappop(minHeap)
```

```ts
const maxHeap = [];
for(let el of x) heappush(maxHeap, el);

// max value
const max = -heappop(maxHeap)
```