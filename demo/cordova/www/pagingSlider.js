/**
 * pagingSlider.js - object class
 *
 * @category  Mobile-Hybrid
 * @package   pagingSlider
 * @author    Nils Gajsek <nils.gajsek@glanzkinder.com>
 * @copyright 2013-2014 Nils Gajsek <nils.gajsek@glanzkinder.com>
 * @license   http://opensource.org/licenses/gpl-license.php GNU Public License
 * @version   0.1
 * @link      https://github.com/linslin
 *
 */

var pagingSlider = {    
        
        
    /** ################## class params ################## **/
    
    /**
     * public - Current page slider page as object
     * @var object
     */
    currentPage : null,
        
    /**
     * private - disabled status. Will be set to true while swiping -> dont touch
     * @var boolean
     */
    _disabled : false,

    /**
     * Global - holds count of elements to overjump due to 
     * page slider slideToPage left direction
     * @var integer
     */
    _pageCount : 0,

    
    
    /** ################## class methods ################## **/
    
    
    /**
     * Sliding a single page to another
     * 
     * @param string sliderPageContainer
     * @param string from
     */
    slidePageFrom: function(sliderPageContainer, from)
    {
        
        //Init function var
        var direction = '';
        
        //check if disabled -> swipe is disabled while animation swipe
        if(pagingSlider._disabled === true){
            return;
        }
        
        //switch direction
        switch(from){
            case 'left':
                direction = 'right';
                page = $(sliderPageContainer + ' .slidepage-container .page.current').prev().first();
            break;
            
            case 'right':
                direction = 'left';
                page = $(sliderPageContainer + ' .slidepage-container .page.current').next().first();
            break;
        }
       
        
        if(page.length > 0){
            
            //switch css classes
            $(page).attr('class', "page current" + from); // Position the page at the starting position of the animation
            $(page).attr('class', "page current transition center");  // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
            $(pagingSlider.currentPage).attr('class', "page transition " + direction);
            
            //setup current page
            pagingSlider.currentPage = page;    
            
           //setup current page pointer //@Todo this could be lines with nice selector and without a loop.. later
            $(sliderPageContainer + ' .footer-menu .pager li').each(function(i, e){
                if(i+1 === parseInt(page.attr('page'))){
                    $(e).removeClass('inactive');
                    $(e).addClass('active');
                }else{
                    $(e).removeClass('active');
                    $(e).removeClass('inactive');
                    $(e).addClass('inactive');
                }
            });
        }
    },
    
    
    /**
     * Switch to a specific page
     * 
     * @param object sliderPageContainer jquery object of 
     * @param string pageId pageId as string
     */
    switchToPage: function(sliderPageContainer, pageId)
    {
        
        //Init vars
        var pages = sliderPageContainer.find('.page');
        var currentPage =  sliderPageContainer.find(".current");
        var maxPageIndex = parseInt(pages.length-1);
        var sickDif = (maxPageIndex-parseInt(currentPage.attr('page')));
        var watchDiv = (maxPageIndex+1) -(parseInt(currentPage.attr('page')));
        
        //check if _disabled -> swipe is _disabled while animation swipe, also return if the current page is clicked
        if(pagingSlider._disabled === true && currentPage.attr('page') === pageId){
            return;
        }
        
        //disable swiping
        pagingSlider._disabled = true;
        
        
        if(parseInt(pageId) > parseInt(currentPage.attr('page'))){
            
            pages.each(function(i, e){
                if( i+1 >= parseInt(currentPage.attr('page'))){
                    setTimeout(function() {
                        pagingSlider.switchIt(e, i, pageId, 'right', null, sliderPageContainer, currentPage);
                        
                        //done
                        if(i+1 === parseInt(pageId)) {
                            pagingSlider._disabled = false; //enable swiping after page swipes are done
                        }
                        
                    }, (300*((i+1)-currentPage.attr('page'))));
                } 
            });
            
        }else if (parseInt(pageId) < parseInt(currentPage.attr('page'))) {
            
            if(parseInt(currentPage.attr('page')) !== (maxPageIndex+1)){
                rightDif = sickDif;
            }else{
                rightDif = sickDif;
            }            
            
            //RESET clogbal count
            pagingSlider._pageCount = 0;
            
            pages.each(function(i, e){
                // aktuelle id - neue id = IIIIII!!!
                if(i < parseInt(currentPage.attr('page'))){
                    setTimeout(function() {
                        pagingSlider.switchIt(pages[(maxPageIndex-(i)-(watchDiv))], i, pageId, 'left', maxPageIndex, sliderPageContainer, currentPage);
                        
                        //done
                        if(i === currentPage.attr('page') - parseInt(pageId)) {
                            pagingSlider._disabled = false; //enable swiping after page swipes are done
                        }
                        
                    }, (300*((i))));
                }
                

            });
        }
        
        
        
    },


    /**
     * Switch an specific element
     * 
     * @param object e
     * @param interger i
     * @param string pageId
     * @param string direction
     * @param integer maxPageIndex
     * @param object sliderPageContainer
     * @param object currentPage
     */
    switchIt: function(e, i, pageId, direction, maxPageIndex, sliderPageContainer, currentPage)
    {
        
        var currentPageId = parseInt($(currentPage).attr('page'));
        var sickVar = (currentPageId-parseInt(pageId));
        
        if(i+1 < pageId && direction === 'right'){
            
            $(e).next('.page').attr('class', "page current left");
            $(e).next('.page').attr('class', "page current transition center");
            $(e).attr('class', "page transition left");
            pagingSlider.currentPage = $(e).next('.page').first();     //set element as current global
            
        }else if(pagingSlider._pageCount < sickVar  && i-1 < (maxPageIndex-parseInt(pageId)) && direction === 'left'){
            
            //count up if direction "left"
            pagingSlider._pageCount++;
            
            $(e).prev('.page').attr('class', "page current right");
            $(e).prev('.page').attr('class', "page current transition center");
            $(e).attr('class', "page transition right"); //set element as current global
            pagingSlider.currentPage = $(e).prev('.page').first();    
        }
        
        //setup current page pointer //@Todo this could be lines with nice selector and without a loop.. later
        $('.footer-menu .pager li').each(function(i, e){
            if(i+1 === parseInt(pagingSlider.currentPage.attr('page'))){
                $(e).removeClass('inactive');
                $(e).addClass('active');
            }else{
                $(e).removeClass('active');
                $(e).removeClass('inactive');
                $(e).addClass('inactive');
            }
        });
    },
    
    
    /**
     * Directly call an other page or set a current page before display
     * 
     * @param string pageId
     */
    setPage: function(sliderPageContainer, pageId)
    {
    	
    	//Init
        var pages = sliderPageContainer.find('.page');

        //check if disabled -> swipe is disabled while animation swipe
        if(pagingSlider._disabled === true){
            return;
        }
        
        //set page classes
        pages.each(function(i, e){
        	if(i+1 < pageId) { // all pages before next current
        		$(e).attr('class', 'page left');
        	} else if (i+1 === pageId) { // current page item to set
        		$(e).attr('class', 'page current');
        	} else if (i+1 > pageId) {  // all pages after next current
        		$(e).attr('class', 'page right');
        	}
        });
        
        //setup page browser
        sliderPageContainer.next('.footer-menu').find('.pager li.active').removeClass('active').addClass('inactive');
        $(sliderPageContainer.next('.footer-menu').find('.pager li').get(pageId-1)).removeClass('inactive').addClass('active');
    }
};