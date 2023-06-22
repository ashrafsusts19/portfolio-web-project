

document.addEventListener('DOMContentLoaded', () => {

    function mergeSortContests(contests, start, end){        
        let mergedContests = [];
        if (start === end){
            mergedContests.push(contests[start]);
            return mergedContests;
        }
        const rank = 'rank';
        let lcontests = [];
        let rcontests = [];
        lcontests = mergeSortContests(contests, start, Math.floor((start + end) / 2));
        rcontests = mergeSortContests(contests, Math.floor((start + end) / 2) + 1, end);
        let lind = 0, rind = 0;
        while (lind < lcontests.length && rind < rcontests.length){
            if (lcontests[lind][rank] < rcontests[rind][rank]){
                mergedContests.push(lcontests[lind]);
                lind++;
            }
            else {
                mergedContests.push(rcontests[rind]);
                rind++;
            }
        }
        while (lind < lcontests.length){
            mergedContests.push(lcontests[lind]);
            lind++;
        }
        while (rind < rcontests.length){
            mergedContests.push(rcontests[rind]);
            rind++;
        }
        return mergedContests;
    }

    function sortContests(contests){
        if (contests.length == 0) return [];
        return mergeSortContests(contests, 0, contests.length - 1);
    }

    function getContestData(handle){
        
        // var userContestData = [];
        
        var p = fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
        p.then(res => {
            if (res.length == 0){
                return [];
            }
            return res.json()
        }) 
        .then(data => {
            userContestData = data.result;
            var divContests = document.getElementById("contest-history");
            var tbleContests = document.createElement("table");
            tbleContests.setAttribute('class', 'contest-data-table');
            tbleContests.setAttribute('border', 1);

            let thHead = document.createElement('tr');
            let headings = ['No', 'Contest ID', 'Contest Name', 'Rank', 'Old Rating', 'New Rating', 'Rating Change']
            for (let i = 0; i < headings.length; i++){
                let col = document.createElement('th');
                col.textContent = headings[i];      
                thHead.appendChild(col);
            }
            tbleContests.appendChild(thHead);
            
            
            userContestData = sortContests(userContestData);            

            let tbleKeys = ['contestId', 'contestName', 'rank', 'oldRating', 'newRating'];
            for (var i = 0; i < Math.min(5, userContestData.length); i++){
                let row = document.createElement('tr');
                row.setAttribute('id', 'user-contest-entry')
                row.setAttribute('data-id', i);
                let col = document.createElement('td');                    
                col.textContent = i + 1;      
                row.appendChild(col);
                for (let key in tbleKeys){
                    col = document.createElement('td');                    
                    col.textContent = userContestData[i][tbleKeys[key]];      
                    row.appendChild(col);
                }
                col = document.createElement('td');
                col.textContent = userContestData[i][tbleKeys[4]] - userContestData[i][tbleKeys[3]];
                row.appendChild(col);
                
                tbleContests.appendChild(row);
            }  
            divContests.appendChild(tbleContests);

        })
    }

    function getProfileData(handle){
        fetch(`https://codeforces.com/api/user.info?handles=${handle}`)
            .then(res => res.json())
            .then(data => {
                // Design pattern er barota bajay disi, shomoy silona sir, maf korben plz                
                let handleData = data.result[0];
                let handleSection = document.getElementById("codeforces-data");
                console.log(handleData);
                let hHandle = document.createElement('h1');                                
                hHandle.textContent = handleData['handle'];
                let hRank = document.createElement('h2');
                hRank.textContent = handleData['rank'].charAt(0).toUpperCase() + handleData['rank'].substring(1);;
                rankClass = handleData['rank'].split(" ");
                hRank.classList.add('handle');
                hHandle.classList.add('handle');
                let pRating = document.createElement('p');
                let pRatingSpan = document.createElement('span');
                pRating.textContent = `Rating: `
                pRatingSpan.textContent = handleData['rating'];
                pRatingSpan.classList.add('handle');
                for (let i in rankClass){
                    hHandle.classList.add(rankClass[i]);
                    hRank.classList.add(rankClass[i]);
                    pRatingSpan.classList.add(rankClass[i]);
                }

                let pMxRank = document.createElement('p');
                let pMxRankSpan = document.createElement('span');
                pMxRank.textContent = `Max Rank: `;
                pMxRankSpan.textContent = handleData['maxRank'].charAt(0).toUpperCase() + handleData['maxRank'].substring(1);

                let pMxRating = document.createElement('p');
                let pMxRatingSpan = document.createElement('span');                
                pMxRating.textContent = `Max Rating: `;
                pMxRatingSpan.textContent = handleData['maxRating'];    

                pMxRatingSpan.classList.add('handle');
                pMxRankSpan.classList.add('handle');
                let mxRankClass = handleData['maxRank'].split(' ');
                for (let i in mxRankClass){
                    pMxRatingSpan.classList.add(mxRankClass[i]);
                    pMxRankSpan.classList.add(mxRankClass[i]);
                }
                pMxRating.appendChild(pMxRatingSpan);
                pRating.appendChild(pRatingSpan);             
                pMxRank.appendChild(pMxRankSpan);
                handleSection.appendChild(hHandle);
                handleSection.appendChild(hRank);
                handleSection.appendChild(pRating);
                handleSection.appendChild(pMxRating);
                handleSection.appendChild(pMxRank);

                let imageSection = document.getElementById("codeforces-image");
                console.log(imageSection);
                let image = document.createElement('img');
                image.setAttribute('src', handleData['titlePhoto']);
                image.setAttribute('width', 'autp');
                image.setAttribute('height', '200px');
                imageSection.appendChild(image);

            });
    }

    // Get all section links
    const sectionLinks = document.querySelectorAll('nav a');

    // Get all sections
    const sections = document.querySelectorAll('.section');

    // Add event listener to each section link
    sectionLinks.forEach(link => {
        console.log(link.id);
        if (link.getAttribute('href') === '#about'){            
            // Initially Add 'active' class to the desired section
            link.parentElement.classList.add('active');
            
            
            // Show the corresponding section based on the link's href
            const targetSectionId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetSectionId);
            targetSection.classList.add('active');
        }
        link.parentElement.addEventListener('click', () => {
            // Remove 'active' class from all section links
            sectionLinks.forEach(link => link.parentElement.classList.remove('active'));
            
            // Add 'active' class to the clicked section link
            link.parentElement.classList.add('active');            
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show the corresponding section based on the link's href
            const targetSectionId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetSectionId);
            targetSection.classList.add('active');
            
        });
    });

    var myHandle = "ashrafsusts19";
    // myHandle = "tourist";
    getContestData(myHandle);
    getProfileData(myHandle);
    


})