// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument


function init(){
    // Select drop-down HTML element
    let selection = d3.select("#selDataset");

    // Pull in JSON and once loading is complete perform the following:
    d3.json("data/samples.json").then(function(incomingData){

        //Extract individual arrays from dataset
        let sampleIDs = incomingData.names;
        let sampleDemos = incomingData.metadata;
        let samples = incomingData.samples;

        // Populate the drop-down list with sample IDs
        sampleIDs.forEach(el => {
         selection.append("option").property("value",el).text(el).sort((a, b) => a - b);
        });

        //Read the selection value from drop-down menu
        let selValue = d3.select("#selDataset").property('value');
        let defDemo = sampleDemos.filter(d=> d.id ===parseInt(selValue))[0];
        let defKeys = Object.keys(defDemo);
        let defVals = Object.values(defDemo);

        //Populate the subject's demographic info card
        let demoArea = d3.select('#sample-metadata')
        for (let i=0; i< defKeys.length; i++){
            demoArea.append("p").attr("class","m-0").text(`${defKeys[i]}: ${defVals[i]}`)
        };

        // Pull OTU ids, values, and labels from subject ID
        let defSamples = samples.filter(d=> d.id === selValue);
        let otu_labels = defSamples.map(d=> d.otu_labels);
        let otu_ids = defSamples.map(d=> d.otu_ids);
        let sampleVals = defSamples.map(d=> d.sample_values);
        
        // Structure data into a JSON for easier sorting
        let defArray = [];
          for (let i=0; i<otu_ids[0].length; i++) {
              defArray.push({"otu_id":otu_ids[0][i],"sample_value":sampleVals[0][i],"otu_label":otu_labels[0][i]});
          }
         let topOTUs = defArray.sort((a, b) => b.sample_value - a.sample_value).slice(0,10);

         /// Horizontal bar graph
         let barData = [{
             x: topOTUs.map(d=>d.sample_value),
             y: topOTUs.map(d=>d.otu_id).map(d=>`otu ${d}`),
             text: topOTUs.map(d=>d.otu_label),
             type: "bar",
             orientation: "h",
             transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }],
              marker: {
                color: "rgba(246, 62, 2, 0.7"}
         }];

         let layout1 = {
             xaxis: {title: "<b># of samples</b>"},
             font: {family: "Roboto", color: '#2A3F57'},
             margin: { t: 40, r: 0, l: 75, b: 35},
             height: 300
         };
         var config = {responsive: true}
         Plotly.newPlot("bar",barData,layout1, config)


         /// Bubble Chart
         let desired_maximum_marker_size = 100;
         let bubbleData = [{
            x: defArray.map(d=>d.otu_id),
            y: defArray.map(d=>d.sample_value),
            text: defArray.map(d=>d.otu_label),
            mode: 'markers',
            marker: {
              size: defArray.map(d=>d.sample_value),
              color: defArray.map(d=>d.otu_id),
              colorscale: "Portland",
              sizeref: 2.0 * Math.max(...defArray.map(d=>d.sample_value)) / (desired_maximum_marker_size**2),
              sizemode: 'area'
            }
          }];
          
          let layout2 = {
            xaxis: {title: "<b>otu id</b>"},
            yaxis: {title: "# of samples"},
            height: 350,
            margin: { t: 40, r: 60, l: 60, b: 35},
            font: {family: "Roboto", color: '#2A3F57'},
            autosize: true

          };
          Plotly.newPlot('bubble', bubbleData, layout2, config);

          /// Gauge Chart
          let gaugeData = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: defDemo.wfreq,
                title: { 
                  text: "scrubs per week", 
                  font: {color: "rgba(246, 62, 2, 1.0",
                  size: 18}
                },
                number: {font: { color: "rgba(246, 62, 2, 1.0"}},
                gauge: {
                    bar: { color: "rgba(246, 62, 2, 1.0"},
                    axis: { range: [null, 10],tickmode: 'array', tickvals: [0,2,4,6,8,10], tickcolor: "rgba(170, 170, 170,1.0)", tickfont: {color:"rgba(170, 170, 170,1.0)"}},
                    steps: [
                      { range: [0, 2], color: "rgba(255, 0, 0, 0.4)"},
                      { range: [2, 4], color: "rgba(255, 165, 0, 0.4)"},
                      { range: [4, 6], color: "rgba(255, 255, 0, 0.4)"},
                      { range: [6, 8], color: "rgba(144, 238, 144, 0.4)"},
                      { range: [8, 10], color: "rgba(154, 205, 50, 0.4)" }
                    ],
                    bordercolor: "white"
                  },
                type: "indicator",
                mode: "gauge+number"
            }];

            var layout3 = {
              height: 200,
              margin: { t: 40, r: 50, l: 50, b: 0},
              autosize: true,
              font: {family: "Roboto", color: '#2A3F57'}
            }

          let config3 = {responsive:true};

          Plotly.newPlot('gauge', gaugeData, layout3,config3);

    })
};

init();

function optionChanged (){
    let selection = d3.select("#selDataset");
    // Pull in JSON and once loading is complete perform the following:
    d3.json("data/samples.json").then(function(incomingData){

        //Extract individual arrays from dataset
        let sampleIDs = incomingData.names;
        let sampleDemos = incomingData.metadata;
        let samples = incomingData.samples;

        //Read the selection value from drop-down menu
        let selValue = d3.select("#selDataset").property('value');
        let selDemo = sampleDemos.filter(d=> d.id ===parseInt(selValue))[0];
        let selKeys = Object.keys(selDemo);
        let selVals = Object.values(selDemo);

        //FRemove default entries and populate the subject's demographic info card
        let demoArea = d3.select('#sample-metadata')
        demoArea.selectAll("p").remove();
        for (let i=0; i< selKeys.length; i++){
            demoArea.append("p").attr("class","m-0").text(`${selKeys[i]}: ${selVals[i]}`)
        };

        // Pull OTU ids, values, and labels from subject ID
        let selSamples = samples.filter(d=> d.id === selValue);
        let otu_labels = selSamples.map(d=> d.otu_labels);
        let otu_ids = selSamples.map(d=> d.otu_ids);
        let sampleVals = selSamples.map(d=> d.sample_values);
        
        // Structure data into a JSON for easier sorting
        let selArray = [];
          for (let i=0; i<otu_ids[0].length; i++) {
              selArray.push({"otu_id":otu_ids[0][i],"sample_value":sampleVals[0][i],"otu_label":otu_labels[0][i]});
          }
         let topSelOTUs = selArray.sort((a, b) => b.sample_value - a.sample_value).slice(0,10);
         console.log(selArray)

         //Restyle horizontal bar graph
         Plotly.restyle("bar","x", [topSelOTUs.map(d=>d.sample_value)]);
         Plotly.restyle("bar","y", [topSelOTUs.map(d=>d.otu_id).map(d=>`otu ${d}`)]);
         Plotly.restyle("bar","text", [topSelOTUs.map(d=>d.otu_label)]);

         //Restyle Bubble chart
         Plotly.restyle("bubble","x", [selArray.map(d=>d.otu_id)]);
         Plotly.restyle("bubble","y", [selArray.map(d=>d.sample_value)]);
         Plotly.restyle("bubble","text", [selArray.map(d=>d.otu_label)]);
         Plotly.restyle("bubble","marker.size", [selArray.map(d=>d.sample_value)]);
         let desired_maximum_marker_size = 100;
         Plotly.restyle("bubble","marker.sizeref", [2.0 * Math.max(...(selArray.map(d=>d.sample_value))) / (desired_maximum_marker_size**2)]);
         Plotly.restyle("bubble","marker.color", [selArray.map(d=>d.otu_id)]);

         //Restyle Gauge Chart
         Plotly.restyle("gauge","value",selDemo.wfreq);

    })
};

d3.select("#selDataset").on("change",optionChanged);