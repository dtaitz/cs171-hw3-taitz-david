# Problem 1 

1. Look at the data given in the Wiki table. Describe the data types. What is different from the datasets you've used before?

* The datatypes in the wikipedia table are integers but they are different because they are formatted with commas. Also, the negative numbers are formatted with a specific time of negation sign. This means that we are going to have to reformat and covert these numbers to integers when we scrape and parse the data.

2. Take a look at the DOM tree for the Wikipedia table. Formulate in jQuery selector syntax the selection that would give you the DOM element for the second row in the Wikipedia table. Write down in selection syntax how you would get all table rows that are not the header row.

* For the second row, the jQuery syntax is as follows $('.wikitable tbody tr').eq(1).

The selection syntax for getting all table rows that are not the header row is as follows: var dataRows = content.find(".wikitable tbody tr:not(:has(th))";