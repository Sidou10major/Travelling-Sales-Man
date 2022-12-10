var OnAddEdgeEdgeData, OnAddEdgeCallback;
var successiveID;
var network = null;
var nodes = new vis.DataSet([{
    id: 0,
    label: 'Node 0'
},
{
    id: 1,
    label: 'Node 1'
},
{
    id: 2,
    label: 'Node 2'
},
{
    id: 3,
    label: 'Node 3'
}
]);

var edges = new vis.DataSet([
]);

// create a network
var data = {
    nodes: nodes,
    edges: edges
};

document.getElementById("confirm").addEventListener("click",function(){
    var from = OnAddEdgeEdgeData.from;
    var to = OnAddEdgeEdgeData.to;
    OnAddEdgeEdgeData.label = document.getElementById("poids").value;
    OnAddEdgeEdgeData.weight = parseInt(document.getElementById("poids").value);
    OnAddEdgeEdgeData.title = document.getElementById("poids").value;//CHANGED
    $('#modal').modal('hide')
    if (from !== to){
      OnAddEdgeCallback(OnAddEdgeEdgeData);
    }
});

function getNextId(){
    return parseInt(data.nodes._data[data.nodes.length-1].id) + 1;
}


function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

function draw() {
    destroy();
    nodes = [];
    edges = [];

    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        physics: {
            enabled: false
        },
        manipulation: {
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                data.id = getNextId();
                data.label = 'Node ' + data.id;
                document.getElementById('operation').innerHTML = "Add Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Edit Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                document.getElementById('network-popUp').style.display = 'block';
            },
            addEdge: function (edgeData, callback) {
                OnAddEdgeEdgeData = edgeData;
                OnAddEdgeCallback = callback;
                document.getElementById("poids").value = 0;
                $('#modal').modal('show');
            },
            deleteNode: function(nodeData,callback){
                // console.log(data.nodes._data);
                // data.nodes._data[data.nodes.length-1].id = nodeData.nodes[0];
                callback(nodeData);
            }

        },
        configure: {
            filter: function (option, path) {
                if (path.indexOf('physics') !== -1) {
                    return true;
                }
                if (path.indexOf('smooth') !== -1 || option === 'smooth') {
                    return true;
                }
                return false;
            },
            container: document.getElementById('config')
        },
        interaction: {

        },

    };
    network = new vis.Network(container, data, options);
}

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveData(data, callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}

function tsp() {
    var edges = data.edges;
    var nodes = data.nodes;
    let l= nodes.length;
    var graph = new Array(l).fill(null).map(() => Array(l).fill(999));
    
    for(var i=0;i<l;i++){
        graph[i][i] = 0;
        edges.forEach(element => {
            graph[element.from][element.to] = element.weight;
            graph[element.to][element.from] = element.weight;
        });
        
    }
    var list = []
    for(var j=0;j<l;j++)list[j]=j
    s = 0

    var t0 = performance.now();
    var o = pvc(graph, s,l)
    var t1 = performance.now();
    var o2 = pvcBackTracking(graph,l)
    var t2 = performance.now();
    var o3 = nearestNeighbourAlgo(graph,list)
    var t3 = performance.now();
    console.log("bruteFroce",o.min_path,"time",t1-t0)
    console.log("backtracking",o2,"time",t2-t1)
    console.log("Nearest neighbour",o3,"time",t3-t2)
    
    

    var tab = [];
    var el = {};
    for(var i = 0 ;i<o.nodes.length;i++){
        el.from = o.nodes[i];
        if (i != o.nodes.length - 1){
            el.to = o.nodes[i+1];
            tab.push(el);
        }else{
            el.to=0;
            tab.push(el);
        }
        el={}
    }
    el={}
    el.from = 0
    el.to = o.nodes[0];
    tab.push(el);


    edges.forEach(element => {

        el={}
        el.from = element.from
        el.to = element.to
        el2={}
        el2.from = element.to
        el2.to = element.from
        if(containsObject(el,tab) || containsObject(el2,tab)){
            edges.update({id:element.id,color :{color:'#ff383f'}})
        }else{
            edges.update({id:element.id,color :{color: '#5F8EC8'}})
        }
    });   

    document.getElementById("exhaustive-time").innerHTML = (t1-t0).toFixed(5)+' ms';
    document.getElementById("exhaustive").innerHTML = o.min_path;
    document.getElementById("vorace-time").innerHTML = (t2-t1).toFixed(5)+' ms';
    document.getElementById("vorace").innerHTML = o2;
    document.getElementById("nn-time").innerHTML = (t3-t2).toFixed(5)+' ms';
    document.getElementById("nn").innerHTML = o3;
    // $('#exhaustive-time').text(t1-t0+' ms')
    // $('#exhaustive').text(o.min_path)
    // $('#vorace-time').text(t2-t1+' ms')
    // $('#vorace').text(o2)
    console.log($('#exhaustive-time').text());
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].from == obj.from && list[i].to == obj.to) {
            return true;
        }
    }

    return false;
}
