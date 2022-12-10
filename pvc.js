function pvc(graph, s,V) {
    //store all vertex apart from source vertex 
    vertex = []

    for (var i = 0; i < V; i++) {
        if (i != s) vertex.push(i)
    }

    min_path = Number.MAX_VALUE;
    var save1= [];
    var oldMinPath=min_path;
    while (true) {
        
        current_pathweight = 0;
        k = s;
        for (var i = 0; i < vertex.length; i++) {
            current_pathweight += graph[k][vertex[i]]
            k = vertex[i]
        }

        current_pathweight += graph[k][s]

        oldMinPath=min_path;
        min_path = Math.min(min_path,current_pathweight)        

        if(min_path<oldMinPath) {
            save1 = [...vertex];
        }
        

        if (!next_permutation(vertex)) break; 
    }
    var result = {
                    "min_path":min_path,
                    "nodes":save1

                 }

    return result;


}


function next_permutation(L) {

    n = L.length; 

    i = n - 2;

    while ((i >= 0) && (L[i] >= L[i + 1])) {
        i -= 1
    }


    if (i == -1){
        return false
    } 

    j = i + 1
    while ((j < n) && (L[j] > L[i])) {
        j += 1
    }
    j -= 1

    save = L[i]
    L[i] = L[j]
    L[j] = save

    left = i + 1
    right = n - 1

    while (left < right) {
        save = L[left]
        L[left] = L[right]
        L[right] = save
        left += 1
        right -= 1
    }
    return true;


}


var answer = []
function backtrackingPVC(graph, v, currPos, n, count, cost){
    if(count == n && graph[currPos][0]>=0){
        answer.push(cost + graph[currPos][0])
        return 0
    }

    for (var i=0;i<n;i++){
        if (v[i] == false && graph[currPos][i]>=0){
            v[i] = true
            backtrackingPVC(graph, v, i, n, count + 1,cost + graph[currPos][i])
            v[i] = false
        }
    }
}
function pvcBackTracking(graph1,n) {

    graph = [
        [0, 1, 10, 20],
        [10, 0, 35, 1],
        [1, 10, 0, 30],
        [10, 25, 1, 0]]
    
    v=new Array(n).fill(false)
    v[0]=true
    answer = []
    backtrackingPVC(graph1, v, 0, n, 1, 0) 
    return Math.min.apply(null,answer)
}
function nearestNeighbourAlgo(graph,list){
    var visited = []
    visited.push(0)
    var result = 0
    index=0
    var oldIndex = 0
    var filteredlist=[]
    var value = 0
    while(true){
        filteredlist=list.filter(item => item !== index)
        list=[...filteredlist]
        oldIndex = index
        value=graph[index][list[0]]
        for (var i = 1; i < graph[oldIndex].length; i++) { 
            if (graph[oldIndex][i] <= value && !visited.includes(i) && i!=index) {
                value = graph[oldIndex][i];
                index = i;
            }       
        }
        if (oldIndex==index) break;
        visited.push(index)
        result+=value
    }
    result+=graph[index][0]
    // console.log(visited)
    console.log('nearestNeighbourAlgo',result)
    return result;
}

