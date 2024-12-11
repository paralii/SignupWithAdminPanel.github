if (window.location.search.indexOf('message=') > -1) {
   
    const url = new URL(window.location);
    url.searchParams.delete('message');
    window.history.replaceState({}, document.title, url.href); 
}