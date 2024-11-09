const fetchSitesData = async () => {
    const response = await fetch( 'domains.csv' );

    if ( ! response.ok ) {
      throw new Error( 'Failed to fetch CSV file' );
    }

    const text = await response.text();
    const rows = text.split( '\n' );

    return { text, rows };
}

const calculateFileSize = ( textContent ) => {
    const size = new TextEncoder().encode( textContent ).length;
    const mbSize = Math.round( size ? size / 1024 / 1024 : 0 );
    return mbSize;
}

const fetchSitesCount = async () => {
  const jsonData = await fetch( 'site-count.json' );
  const body = await jsonData.json();
  const { siteCount } = body;

  return siteCount;
}

const formatNumber = ( number ) => {
  if ( ! number ) {
    return '';
  }

  const roundedNumber = Math.ceil( number / 10 ) * 10;

  if ( number < 100000 ) {
    return roundedNumber.toLocaleString();
  }

  const numberString = Math.floor( roundedNumber / 1000 ).toLocaleString();
  const decimalString = Math.floor( ( roundedNumber % 1000 ) / 100 );

  return `${ numberString }.${ decimalString}K`;
}

// const isValidURL = ( str ) => {
//   try {
//     new URL( str );
//     return true;
//   } catch ( _ ) {
//     return false;
//   }
// }

// const prepareDomain = ( input ) => {
//   if ( isValidURL( input ) ) {
//     input = new URL( input ).hostname;
//   }

//   // Remove unwanted characters (keeping only letters, numbers, hyphens, and dots)
//   const sanitized = input.replace( /[^a-zA-Z0-9.-]/g, '' );

//   return sanitized;
// }

// const isValidDomain = ( domain ) => {
//   const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/;
//   return domainRegex.test(domain);
// }

// const updateFormResult = ( type = 'empty' ) => {
//   const formResultElement = document.getElementById( 'form-result' );
//   const inputElement = document.querySelector( 'input#domain' );

//   inputElement.classList.remove( 'error' );
//   inputElement.classList.remove( 'success' );
//   formResultElement.classList.remove( 'error' );
//   formResultElement.classList.remove( 'success' );

//   if ( type === 'not-valid' ) {
//     formResultElement.innerHTML = "Not a valid domain";
//     inputElement.classList.add( 'error' );
//     formResultElement.classList.add( 'error' );
//     return;
//   }

//   if ( type === 'filled-out' ) {
//     formResultElement.innerHTML= "Press enter to search";
//     return;
//   }

//   if ( type === 'still-hosted' ) {
//     formResultElement.innerHTML = "Still hosted by WP Engine";
//     inputElement.classList.add( 'error' );
//     formResultElement.classList.add( 'error' );
//     return;
//   }

//   if ( type === 'not-hosted' ) {
//     formResultElement.innerHTML = "Not hosted by WP Engine";
//     inputElement.classList.add( 'success' );
//     formResultElement.classList.add( 'success' );
//     return;
//   }

//   formResultElement.innerHTML = "Please enter a domain";
// }

// const handleSearchForm = async () => {
//   const allDomains = new Set();
//   const searchForm = document.querySelector( 'form#search-form' );
//   const inputElement = document.querySelector( 'input#domain' );
//   const searchIcon = document.getElementById( 'search-icon' );

//     const setDownloadSizeEstimate = mb => {
//         document.querySelector( '.download-button__content' ).textContent = mb ? `Download (${ mb }MB)` : 'Download';
//     }

//     const wpeSites = [
//       /\.wpengine\.com$/,
//       /\.wpenginepowered\.com$/,
//       /\.flywheelsites\.com$/,
//       /\.flywheelstaging\.com$/,
//       /^wpenginepowered\.com$/,
//       /^flywheel\.io$/
//     ];

//     try {
//       const { text, rows } = await fetchSitesData();
  
//       setDownloadSizeEstimate( calculateFileSize( text ) );    

//       rows.map( row => row.trim() )
//         .filter( row => row )
//         .forEach( domain => allDomains.add( domain ) );
  
//       console.log( `Loaded CSV with ${allDomains.size} domains` );
//     } catch (error) {
//       console.error( 'Error loading CSV: ', error );
//     }
    
//     const isHostedOnWPE = domain => {
//       const lowerDomain = domain.toLowerCase();
//       return allDomains.has( lowerDomain ) || wpeSites.some( regex => regex.test( lowerDomain ) );
//     }

//     inputElement.addEventListener( 'input', event => {
//         const domain = prepareDomain( event.target.value );

//       if ( ! domain ) {
//         updateFormResult( 'empty' );
//         searchIcon.style.display = 'initial';
//         return;
//       }

//       updateFormResult( 'filled-out' );
//       searchIcon.style.display = 'none';
//     } );

//     searchForm.addEventListener( 'submit', event => {
//       event.preventDefault();
//       const domain = prepareDomain( event.target.elements['domain'].value );

//       if ( domain ) {
//         if ( ! isValidDomain( domain ) ) {
//           updateFormResult( 'not-valid' );
//         } else if ( isHostedOnWPE( domain ) ) {
//           updateFormResult( 'still-hosted' );
//         } else {
//           updateFormResult( 'not-hosted' );
//         }
//       }

//       return domain && isHostedOnWPE( domain );
//     } );
// }

// document.addEventListener( 'DOMContentLoaded', async () => {
//     handleSearchForm();
// } );

function triggerRecentlyMovedAnimation() {
  const site = document.querySelector(".recently-moved");

  const keyframes = [
    { transform: 'translateY(24px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1, offset: 0.05 },
    { transform: 'translateY(0)', opacity: 1, offset: 0.95 },
    { transform: 'translateY(-24px)', opacity: 0 }
  ];

  const options = {
    duration: 4000,
    iterations: 1,
  };

  site.animate(keyframes, options);
}

function initRecentlyMoved() {
  fetch("site-count.json")
    .then((response) => response.json())
    .then(async (data) => {
      const hostsRes = await fetch('hosts.json');
      const hosts = await hostsRes.json();

      const urls = data.recentlyMoved.map(item => item.domain_name);
      const hostData = data.recentlyMoved.map(item => {
        return {
          'host': item.destination,
          'image': hosts[item.destination].image
        }
      });
      const site = document.querySelector(".recently-moved");

      let currentIndex = 0;

      function updateTicker() {
        site.innerHTML = `
            <div class="recently-moved-site">
                <a href="https://${urls[currentIndex]}" target="_blank">${urls[currentIndex]}</a>
                <img src="images/arrow-up-right.svg" alt="→" />
            </div>
            <div class="recently-moved-site-destination">
              <img src=${hostData[currentIndex]['image']} alt=${hostData[currentIndex]['host']} />
              <p>${hostData[currentIndex]['host']}</p>
            </div>
        `;

        currentIndex = (currentIndex + 1) % urls.length;
        triggerRecentlyMovedAnimation();
      }

      updateTicker();
      setInterval(updateTicker, 4000);
    });
}

function initChart() {
  fetch("site-count.json")
    .then((response) => response.json())
    .then((data) => {
      const stats = data.dailyMovedStat;
      const barsContainer = document.querySelector(".bars-container");

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      barsContainer.appendChild(tooltip);

      let tooltipTimeout;

      const maxValue = Math.max(...Object.values(stats));
      const entries = Object.entries(stats);

      // Create bars
      entries.reverse().forEach(([date, value], index) => {
        const height = (value / maxValue) * 100;
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${height}%`;
        bar.dataset.value = value;
        bar.style.animationDelay = `${index * 30}ms`;
        barsContainer.appendChild(bar);
      });

      // Update tooltip on mousemove
      const updateTooltip = (e) => {
        clearTimeout(tooltipTimeout);
        tooltip.style.opacity = "1";

        const barsContainerRect = barsContainer.getBoundingClientRect();
        const relativeX = e.clientX - barsContainerRect.left;
        const barWidth = barsContainerRect.width / entries.length;
        const barIndex = Math.min(
          Math.floor((relativeX + barWidth / 2) / barWidth),
          entries.length - 1
        );

        if (barIndex >= 0 && barIndex < entries.length) {
          const bar = barsContainer.children[barIndex + 1];
          if (bar && bar.classList.contains("bar")) {
            tooltip.style.left = `${e.clientX - barsContainerRect.left}px`;
            tooltip.textContent = bar.dataset.value;
          }
        }
      };

      // Handle mouse leave
      barsContainer.addEventListener("mouseleave", () => {
        tooltipTimeout = setTimeout(() => {
          tooltip.style.opacity = "0";
        }, 500);
      });

      barsContainer.addEventListener("mousemove", updateTooltip);
    });
}

function animateNumber(element, start, end, duration = 500) {
  const startTime = performance.now();
  const startNumber = parseInt(start);
  const endNumber = parseInt(end);
  const difference = endNumber - startNumber;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuad = 1 - Math.pow(1 - progress, 2);
    const currentNumber = Math.floor(startNumber + difference * easeOutQuad);

    element.textContent = formatNumber(currentNumber);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initTopDestinations() {
  fetch("site-count.json")
    .then((response) => response.json())
    .then( async (data) => {
      const hostElement = document.querySelector(".host");
      const sitesCount = document.querySelector("#sites-count");

      // Get top 7 destinations
      const topFive = Object.entries(data.topDestinationHosts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

      const hostsRes = await fetch('hosts.json');
      const hosts = await hostsRes.json();

      topFive.forEach(([host, count]) => {
        const hostData = hosts[host];
        const item = document.createElement("li");
        item.className = "host-item";
        item.innerHTML = `
          <a
            href="${hostData.href}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${host}${' '}${hostData['has_promo'] ? '<span class="promo">(Promo)</span>' : ''}
            <img src="images/arrow-up-right-black.svg" alt="→" />
          </a>
          
        `;

        item.addEventListener("mouseenter", () => {
          animateNumber(
            sitesCount,
            sitesCount.textContent.replace(/[^\d]/g, ""),
            count
          );
        });

        item.addEventListener("mouseleave", () => {
          animateNumber(
            sitesCount,
            sitesCount.textContent.replace(/[^\d]/g, ""),
            data.siteCount
          );
        });

        hostElement.appendChild(item);
      });
    });
}

window.addEventListener("load", async () => {
  const sitesCount = await fetchSitesCount();
  const sitesCountElement = document.getElementById("sites-count");
  sitesCountElement.textContent = formatNumber(sitesCount);
});

document.addEventListener("DOMContentLoaded", () => {
  initRecentlyMoved();
  initChart();
  initTopDestinations();
}); 
