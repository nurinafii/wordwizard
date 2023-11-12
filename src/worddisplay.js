function getWordMeaning(searchInputId) {
    const wordInput = document.getElementById(searchInputId);
    const word = wordInput.value;

    if (word.trim() !== "") {
        // Update the word in your HTML
        document.getElementById("word").textContent = word;
        const meaningHeading = document.getElementById("meaning-heading");
        meaningHeading.textContent = ` ${word}`;
        // Perform the API call with the provided word
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    var wordData = data[0];
                    var meanings = wordData.meanings;

                    var meaningsHTML = "";
                    var exampleHTML = "";
                    var antonymsHTML = "";
                    var synonymsHTML = "";
                    var relatedUrlsHTML = "";
                    var audioAvailable = false;

                    if (wordData.phonetic) {
                        document.getElementById("phonetics").textContent = ` ${wordData.phonetic}`;
                    }

                    for (var i = 0; i < wordData.phonetics.length; i++) {
                        if (wordData.phonetics[i].audio) {
                            audioAvailable = true;
                            document.getElementById("word-sound").src = wordData.phonetics[i].audio;
                            break; // Exit the loop once the first available audio is found
                        }
                    }

                    if (!audioAvailable) {
                        // If no audio is found in the first set, try another set
                        for (var i = 0; i < wordData.phonetics.length; i++) {
                            if (wordData.phonetics[i].audio) {
                                audioAvailable = true;
                                document.getElementById("word-sound").src = wordData.phonetics[i].audio;
                                break; // Exit the loop once the next available audio is found
                            }
                        }
                    }

                    if (!audioAvailable) {
                        document.getElementById("sounds-box").style.display = "none";
                    }

                    meanings.forEach((meaning) => {
                        meaning.definitions.forEach((definition) => {
                            meaningsHTML += `<li>${meaning.partOfSpeech}: ${definition.definition}</li>`;

                            // Display example usage
                            if (definition.example) {
                                exampleHTML += `<li>${definition.example}</li>`;
                            }

                            // Display antonyms
                            if (definition.antonyms && definition.antonyms.length > 0) {
                                antonymsHTML += `<li>${meaning.partOfSpeech}: ${definition.antonyms.join(', ')}</li>`;
                            }

                            // Display synonyms
                            if (definition.synonyms && definition.synonyms.length > 0) {
                                synonymsHTML += `<li>${meaning.partOfSpeech}: ${definition.synonyms.join(', ')}</li>`;
                            }
                        });
                    });

                    // If no antonyms are found in the first set of definitions, try another set
                    if (antonymsHTML === "" && meanings.some(meaning => meaning.definitions.some(def => def.antonyms && def.antonyms.length > 0))) {
                        meanings.forEach((meaning) => {
                            meaning.definitions.forEach((definition) => {
                                if (definition.antonyms && definition.antonyms.length > 0) {
                                    antonymsHTML += `<li>${meaning.partOfSpeech}: ${definition.antonyms.join(', ')}</li>`;
                                }
                            });
                        });
                    }

                    // If no synonyms are found in the first set of definitions, try another set
                    if (synonymsHTML === "" && meanings.some(meaning => meaning.definitions.some(def => def.synonyms && def.synonyms.length > 0))) {
                        meanings.forEach((meaning) => {
                            meaning.definitions.forEach((definition) => {
                                if (definition.synonyms && definition.synonyms.length > 0) {
                                    synonymsHTML += `<li>${meaning.partOfSpeech}: ${definition.synonyms.join(', ')}</li>`;
                                }
                            });
                        });
                    }

                    if (antonymsHTML === "") {
                        antonymsHTML = "<li>No antonyms found.</li>";
                    }

                    if (synonymsHTML === "") {
                        synonymsHTML = "<li>No synonyms found.</li>";
                    }

                    if (wordData.phonetics && wordData.phonetics.length > 0) {
                        for (var i = 0; i < wordData.phonetics.length; i++) {
                            // Display source URLs as links from phonetics
                            if (wordData.phonetics[i].sourceUrl) {
                                
                                relatedUrlsHTML += `<a href="${wordData.phonetics[i].sourceUrl}" target="_blank">Source URL <br></br></a></li>`;
                            }
                        }
                    }

                    if (exampleHTML === "") {
                        exampleHTML = "<li>No example usage found.</li>";
                    }

                    if (wordData.meanings.length === 0) {
                        document.getElementById("meaning-list").textContent = "Meaning not found in the dictionary.";
                        document.getElementById("example-list").innerHTML = exampleHTML;
                        document.getElementById("antonyms-list").innerHTML = antonymsHTML;
                        document.getElementById("synonyms-list").innerHTML = synonymsHTML;
                        document.getElementById("related-urls-list").innerHTML = relatedUrlsHTML || "<li>No source URLs found.</li>";
                    } else {
                        document.getElementById("meaning-list").innerHTML = meaningsHTML;
                        document.getElementById("example-list").innerHTML = exampleHTML;
                        document.getElementById("antonyms-list").innerHTML = antonymsHTML;
                        document.getElementById("synonyms-list").innerHTML = synonymsHTML;
                        document.getElementById("related-urls-list").innerHTML = relatedUrlsHTML || "<li>No source URLs found.</li>";
                    }
                } else {
                    document.getElementById("meaning-list").textContent = "Word not found in the dictionary.";
                    // You can handle this case as needed
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
                document.getElementById("meaning-list").textContent = "An error occurred while fetching the meaning.";
                // You can handle errors or display an error message here
            });
    } else {
        // Handle the case where the 'word' parameter is not provided.
        document.getElementById("meaning-list").textContent = "Please enter a word.";
        // You can display a message or perform other actions as needed.
    }
}

// Call the function when the page loads
document.getElementById("search-button").addEventListener("click", function () {
    getWordMeaning("word");
});
