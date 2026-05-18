# Detailed Design: Guestbook for exoad.net

## Overview

Add a classic guestbook to the personal website. Visitors submit name + message through a Turnstile-protected form. Entries go into a manual review queue before appearing publicly. Admin dashboard at /guestbook/admin for approving, rejecting, deleting entries and managing IP bans.

Backend: Cloudflare Pages Functions + D1 (SQLite). Frontend: React components integrated into existing Vite SPA with Gruvbox theme.

---

## Architecture

Already on Cloudflare Pages — use Pages Functions (no separate Worker deployment).

```
Visitor Browser                    Admin Browser
     |                                    |
     | GET /guestbook                     | GET /guestbook/admin
     v                                    v
React SPA (static)                  React SPA (static)
     |                                    |
     | POST /api/guestbook/submit         | POST /api/admin/login
     v                                    v
Pages Functions                     Pages Functions
(functions/api/)                    (functions/api/admin/)
     |                                    |
     +---------- D1 Database -------------+
```

Turnstile verification via https://challenges.cloudflare.com/turnstile/v0/siteverify.

---

## Data Models (D1 Schema)

### Table: entries

| Column      | Type    | Constraints              |
|-------------|---------|--------------------------|
| id          | INTEGER PRIMARY KEY AUTOINCREMENT Unique identifier                |
nnameTEXTNOTNULLVisitorsdisplaynamemax100charsenforcedinAPImessageTEXTNOTNULLVisitorsmessagemax1000charsenforcedinAPIcreatedatTEXTNOTNULLDEFAULTdatetimenowISOtimestampapprovedINTEGERNOTNULLDEFAULT00pending1approved2rejected3deletedTablebansColumnTypeConstraintsNotesipTEXTPRIMARYKEYBannedIPaddresscreatedatTEXTNOTNULLDEFAULTdatetimenowWhenbanwasaddedRateLimitingKVStoreKeyPatternratelimitipvalueJSONcountlastresetUsedforperhourratecheckingNotpersistentlongtermjustforratelimitingwindowBackendAPIEndpointsAllendpointsliveunderfunctionsapifollowingCloudflarePagesfilebasedroutingPOSTapiguestbooksubmitCreatesanewentrypendingstateRequestname:stringmessage:stringturnstiletoken:stringValidationnamerequiredmax100charsmessagerequiredmax1000charsturnstiletokenrequiredRateLimitCheckKVkeyratelimitipIfcount5withinlasthourreturn429TurnstileVerificationPOSTtohttpschallengescloudflarecomturnstilev0siteverifywithsecretkeytokenremoteipIffailurereturn400InsertINSERTINTOentriesnamemessagecreatedatapprovedVALUES??datetimenow0Response200success:truemessageYourentryhasbeensubmittedforreviewGETapiguestbooklistQueryparams?page=1&limit=50QuerySELECTidnamemessagecreatedatFROMentriesWHEREapproved=1ORDERBYcreatedatDESCLIMIT?OFFSET?CountSELECTCOUNTastotalFROMentriesWHEREapproved=1Response200entries:Entry[]totalPages:numbercurrentPage:numberPOSTapiadminloginRequestpassword:stringCompareSHA256hashagainstenvADMINPASSWORDIfmatchcreateHMACsignedsessiontokensetcookiegbsessionHttpOnlySecureSameSiteLax7dayexpiryResponse200success:trueIfnomatch401errorInvalidpasswordGETapiadminpendingRequiresvalidsessioncookieQuerySELECT*FROMentriesWHEREapproved=0ORDERBYcreatedatASCResponse200entries:Entry[]PATCHapiadminentryidRequiresvalidsessioncookieRequestbodyapproved:int01approve2rejectUPDATEentriessETapproved=?WHEREid=?Response200success:trueDELETEapiadminentryidRequiresvalidsessioncookieDELETEFROMentriesWHEREid=?Response200success:truePOSTapiadminbanRequiresvalidsessioncookieRequestbodyip:stringINSERTINTObansipcreatedatVALUES?datetimenowORstoreinKVsetbannediptrueResponse200success:trueGETapiadminbansRequiresvalidsessioncookieSELECTipFROMbansORDERBYcreatedatDESCResponse200ips:string[]MiddlewareSharedsessionverificationforalladminroutesasyncfunctionrequireAdmincontextconstcookiesparsecookiescontextrequestheadersgetCookieconstsessionTokencookiesgbsessionif!sessionTokenreturnnewResponseJSONerrorUnauthorizedstatus401constisValidawaitverifySessionsessionTokencontextenvif!isValidreturnnewResponseJSONerrorInvalidsessionstatus403FrontendComponentsGuestbookPagetsxRouteguestbookLayoutCenteredcolumnmaxw2xlFormNameinputtextMessagetextareaTurnstilewidgetdivclasscfturnstiledatasitekeySubmitbuttonEntriesListPaginated50perpageEachcardnamedatemessagenewestfirstPaginationPrevNextbuttonsStateinterfaceGuestbookPageStateentriesEntry[]currentPagenumbertotalPagesnumberloadingbooleanformNamestringformMessagestringsubmittingbooleanerrorstringnullGuestbookAdminPagetsxRouteguestbookadminTwoStatesUnauthenticatedPasswordformcenteredGruvboxstyledAuthenticatedDashboardPendingQueueTablewithapproverejectbuttonsApprovedEntriesTablewithdeletebuttonBannedIPsInputfieldbanbuttonlistofcurrentbansLogoutbuttonStateinterfaceAdminStateauthenticatedbooleanpendingEntriesEntry[]approvedEntriesEntry[]bannedIpsstring[]passwordstringerrorstringnullGuestbookCTAtsxHomepageteasersectionPlacedinContentSectionsonHomePagetsxMatchesexistingWritingsectionpatternLinkWanttosayhiSigntheguestbooksimplecardlinkingtoguestbookErrorHandlingAllAPIresponsesuseconsistentJSONformatHTTPStatusBodyExampleMeaning400errorsMissingrequiredfieldValidationfailure429errorsRatelimitexceededRatelimithit401errorsInvalidpasswordLoginfailure403errorsInvalidsessionSessionexpired404errorsEntrynotfoundBadID500errorsSomethingwentwrongServererrorTestingStrategyUnitTestsVitestforReactcomponentsFormrendersvalidationerrormessageshandlessubmissionstatesEntriesrenderspaginatedlisthandlesemptyloadingerrorstatesIntegrationTestsTestAPIendpointsviawranglerdevSubmitcreatesrowwithapproved0ListreturnsonlyapprovedsortedbypaginationLoginssetcookieapproveupdatesrowdeleteandbanworkE2ETestsPlaywrightoptionalFullflowsubmitseesuccessviewspublicpageseesonlyafterapproveConnectionsroughideamdideahoningmdresearchexistingsolutionsmdresearchcloudflareintegrationmdresearchreactintegrationmd</parameter>
