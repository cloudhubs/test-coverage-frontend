export const Data = [
    {
        type: 1,
        year: "fully",
        total: 35
    },
    {
        type: 2,
        year: "partially",
        total: 2
    },
    {
        type: 3,
        year: "not",
        total: 6
    }
];

const data = {
    labels: ['Red', 'Orange', 'Blue'],
    // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
    datasets: [
        {
            label: 'Popularity of colours',
            data: [55, 23, 96],
            // you can set indiviual colors for each bar
            backgroundColor: [
                "rgb(54,144,22)",
                "#e5c649",
                "#992313"
            ],
            borderWidth: 1,
        }
    ]
}