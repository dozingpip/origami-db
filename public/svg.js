
let pattern = RabbitEar.Origami({ padding: 0.05 });
pattern.vertices.visible = true;
pattern.load(data);
pattern.svg.setAttribute("id", "svg");
pattern.svg.onMouseMove = function(event){
    pattern.vertices.forEach(function (v) { v.svg.style = ""; });
    pattern.edges.forEach(function (e) { e.svg.style = ""; });
    pattern.faces.forEach(function (f) { f.svg.style = ""; });
    // get all the nearest components to the cursor
    const nearest = pattern.nearest(event);
    // console.log(nearest);
    if (nearest.vertex) { nearest.vertex.svg.style = "fill:#357;stroke:#357"; }
    if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
    if (nearest.face) { nearest.face.svg.style = "fill:#e53"; }
};