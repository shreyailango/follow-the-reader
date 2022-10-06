const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`, 
{ method: "GET", 
  headers: {'Content-Type': 'application/json'}})
  .then(res => res.json())
  .then(book => displayBooks(book["items"]))
  .catch(err => console.error("error: " + err));

displayBooks = books => {
    console.log("function is called");
    const resultsDiv = document.getElementById("searchResults");
    books.forEach(book => {
      console.log(book["volumeInfo"]["title"]);
      const bookElement = document.createElement("p");
      bookElement.textContent = `book["volumeInfo"]["title"]`;
      resultsDiv.append(bookElement);
    });
  }
  