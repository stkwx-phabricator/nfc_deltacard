## NFC data demo: 
`
product~serial~user~prod~start~sav1~sav2~sav3~sav4~sav5~newFlag            
`            
## Code Demo:    
``` 
mimeCallBack: function (nfcEvent) {
        var tag = nfcEvent.tag,
          ndefMessage = tag.ndefMessage;
        tagId = nfc.bytesToHexString(tag.id);
        console.log(tagId);
        nfcData = nfc.bytesToString(ndefMessage[0].payload).split('~');
        if (nfcData.length != 11) {
          nfcData = [
            '', //product
            '', //serial
            '', //user
            '', //prod.
            '', //start
            '', //sav1
            '', //sav2
            '', //sav3
            '', //sav4
            '', //sav5
            '0' //if first use 0:new
          ];
          message = [
            ndef.mimeMediaRecord('mime/com.softtek.delta', nfc.stringToBytes(nfcData.join("~"))),
            ndef.uriRecord("http://www.deltaplus.eu")
          ];
          nfc.write(message, function () {

          }, function (error) {
            // todo there is some random error when saving data into card, eg. if you move card during writing process.
            myAlert('appError', error);
          });
          myAlert('dataFomatNotRight', [nfc.bytesToHexString(tag.id)]);
          return;
        }
```