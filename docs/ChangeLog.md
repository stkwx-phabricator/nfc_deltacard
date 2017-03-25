## Changes on 2017-03-22  v1.7.2
- Use the login page as the default page when open a app.
- Auto sync data between app and website when user login. 2 synchronization job as below
    - Auto upload data into website from APP DB
    - Then auto download data into APP DB from website
- Keep user login status even user close the app, unless user click the sign-out button.
- When user reopen app,
    - automatically sign-in if with network, and do data synchronization of step 2
    - Automatically log-off user if no network.

## Changes on 2017-02-02  v1.7.1
- Change web access link to new URL and add new link for "About Manager"
- Rename upload/ download my product list button label
- Change the error message for text length limit when edit product details
- re-format date field. Only display MONTH/ YEAR, remove DAY; but when upload to website, need give a default DAY as 15.
- Fix the issue that when upload, always creating new records.

## Changes on 2017-01-07 v1.7.0
- force user email input to lower case when user login and register  -- done
- correction on the language translation (waiting Georges help)  -- done
- change label as "Web Access" from PPE Manager when opening website  -- done
- Use logout to replace “my PPE status"   -- done
- link to annual check page when click “Operation Structure”    -- done
- only username and all date fields are editable. -- done
- 

## Changes on 2016-12-26
- Change the way of opening URL, using system browser, instead of app inside   - done  
- Hide the menu "My PPE Status" - done  
- Change the Links to annual check service page and label to "Web Access" instead of My PPE Manager   - done
- Language translation - done
- Fix issue after choose french and spanish, if goto change lanugage again, it will move to English automatically.  -- done.
- Avoid insert empty NFC into production list -- done
- Change date format to 'dd/mm/yyyy' -- done


## BUG SUMMARY
```    
    DONE(10H): new requirements 
    DONE (8H) 2nd round of test  
    Done (4 H ) New Feature: required by George and Michale 
    DONE( 3H ) New Feature: force user input to lower case when user login and register 
    DONE(4 H) Bug: After create a new equipement, the equipmentId isnot update successfully bug 
    Done (2H) Forgot password and find it back 
    DONE (3H) BUG: annual-check create equipment WS not save maintenance date 
    DONE(6H) BUG: Mobile APP date only have mm/YYYY 
    DONE(3H) BUG: data is not update when import data from remote WS into mobile bug   
    DONE(1H): Setup a way to debug cordova APP by GapDebug help wanted invalid wontfix 
    DONE(4H) : there is no deletion logic in current Webservice question  
    DONE(4 H): Handle the Registion message correctly enhancement 
    DONE (4h) : APP login failed bug 
    DONE(6 H) Replace get method with POST enhancement 
    DONE (18H): Upload product to remote Server by Call New API enhancement 
    DONE (4h) : Download Delta products into mobile enhancement  
```