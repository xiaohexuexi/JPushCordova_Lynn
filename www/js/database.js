//modified on 2016/11/08

/*message结构：
JpushMessage = {
	id: 1,
	content: 'aaa',
	pushtime: '2016-10-28 20:20:20',
	read: 0
}
*/

/* 数据库表设计
CREATE TABLE Message (
id integer primary key NOT NULL,
content text NOT NULL,
pushtime datetime NOT NULL,
read integer
)
*/


//global variable
var g_db;
var msgSearchArray=new Array();

function createDB() {
	
	console.log("database: createDB");

	g_db = sqlitePlugin.openDatabase('message.db', '1.0', '', 1);
	g_db.transaction( function (txn) {
		//txn.executeSql('CREATE TABLE message(id integer NOT NULL PRIMARY KEY AUTOINCREMENT, jpushid integer DEFAULT 0, content TEXT NOT NULL, pushtime DATETIME NOT NULL, read integer DEFAULT 0);', [], function(tx, res) {
		txn.executeSql('CREATE TABLE message(id integer NOT NULL PRIMARY KEY, content TEXT NOT NULL, pushtime DATETIME NOT NULL, read integer DEFAULT 0);', [], function(tx, res) {
			console.log(res.rows.item(0));
		 });		
	});
	
	//test sqlite
//	testCase();
}

function testCase() {

	console.log("============ testCase start ===========");
	
//	insertMessage("message 11", insertMessageCallback);
//	insertMessage("message 12", insertMessageCallback);
//	insertMessage("message 14", insertMessageCallback);
//	insertMessage("message 15", insertMessageCallback);
//	insertMessage("message 16", insertMessageCallback);
	
	
//	readMessage([7,9], readMessageCallback);
//	readMessage([11], readMessageCallback);
	
//	searchMessage("message", searchMessageCallback);
	
//	readMessage([-1], readMessageCallback);
	
//	searchMessage("", searchMessageCallback);
	
//	deleteMessageById([3], deleteMessageCallback);
//	deleteMessageById([4,6], deleteMessageCallback);
	
//	deleteMessageById([-1], deleteMessageCallback);

//	findMessageById(5, findMessageByIdCallback);

//	getMaxID(getMaxIDCallback);
}

//////////////////////////////////////////////////////////////////////////////
///////////////////需实现的回调函数list, 以下实现仅做调试打印功能///////////////////
//msgTotalArray: 返回所有的message array

/*function insertMessageCallback(msgTotalArray)
{
	console.log("msgArrayAfterInsert length is " + msgTotalArray.length);
	for (i = 0; i < msgTotalArray.length; i ++){
		console.log("msgArrayAfterInsert: " + msgTotalArray[i].id + ", " 
				+ msgTotalArray[i].content + ", " 
				+ msgTotalArray[i].pushtime+ ", " 
				+ msgTotalArray[i].read );
	}
};*/

//resultReadMessage: 成功设置已读多少条记录
/*function readMessageCallback(resultReadMessage)
{
	console.log("readMessageCallback set read " + resultReadMessage + " message");
};

//resultDeleteMessage: 成功或失败，失败情况包括：实际删除的条数和要删除的条数不符合
function deleteMessageCallback(resultDeleteMessage)
{
	console.log("deleteMessageCallback delete message, return " + resultDeleteMessage);
};*/

//msgSearchArray: 返回search到的message array
/*function searchMessageCallback(msgSearchArray)
{ 
	console.log("msgSearchArray length is " + msgSearchArray.length);
	for (i = 0; i < msgSearchArray.length; i ++){
		console.log("msgSearchArray: " + msgSearchArray[i].id + ", " 
				+ msgSearchArray[i].content + ", " 
				+ msgSearchArray[i].pushtime+ ", " 
				+ msgSearchArray[i].read );
	}
};
*/

/*function findMessageByIdCallback(msgFind)
{
	console.log("find message: " + msgFind.id + "," 
			+ msgFind.content + "," 
			+ msgFind.pushtime+ "," 
			+ msgFind.read );
};

function getMaxIDCallback(maxid){
	
	console.log("getMaxIDCallback: " + maxid);
}*/

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



//输入参数定义：
//var keyValue: ”keyValue”; /*字符串*/
//callback：参数为message数组
//返回结果定义：
//messages = [
//	{/*message1*/
//			id: “jpush ID”,
//			content: “消息内容”,
//			time: “2016-10-28”,
//		read: false
//},
//	message2,
//	…
//];
//执行逻辑：
//在搜索框中填入关键字keyValue，后台根据关键字查询数据库，应该支持关键字和日期两个方式,查询结果还是要orderby time排序,如果keyWords为空就是查询全部.
//回调函数：function searchMessageCallback(msgSearchArray)，其中msgSearchArray为找到的message list
function searchMessage(keyValue, searchMessageCallback) {

	var i, messageCnt = 0;
	
	if(typeof keyValue == "undefined") {	
		keyValue = "";
	}
	
	console.log("database: searchMessage, keyValue is[" + keyValue + "]");
	
	//select * from message where content like '%test%'
	var sqlSearchMessage = "select * from message where content like '%" + keyValue + "%' order by pushtime desc;"; //降序
	console.log(sqlSearchMessage);

	g_db.transaction( function (txn) {
		txn.executeSql(sqlSearchMessage, [], function(tx, res) {

		    messageCnt = res.rows.length;
			console.log("messageCnt is " + messageCnt);
		    for (i = 0; i < messageCnt; i ++){
		    	msgSearchArray[i] = {
			    			"id": res.rows.item(i).id,
			    			"content": res.rows.item(i).content,
			    			"pushtime": res.rows.item(i).pushtime,
			    			"read": res.rows.item(i).read,
				}
		    }
		    searchMessageCallback(msgSearchArray);
		 });
	});

}


//输入参数定义：
//message: 插入的消息
//无返回结果
function insertMessage(message, jpushid, insertMessageCallback) {

	//insert into message(id, content, pushtime, read) values("11343543534", "aaaa", DATETIME('now', 'localtime'), 0);
	//var sqlInsert = "insert into message(content, pushtime, read) values(\"" + message 
	//					+ "\"" + ", DATETIME(\'now\', \'localtime\'), 0);";
	
	var sqlInsert = "insert into message(id, content, pushtime, read) values(" + jpushid + ",\"" + message + "\"" 						
						+ ", DATETIME(\'now\', \'localtime\'), 0);";
	var sqlQuery = "select * from message order by pushtime desc;";
	var findCnt = 0;

	g_db.transaction( function (txn) {
		
		console.log("insertMessage: " + sqlInsert);
		txn.executeSql(sqlInsert, [], function(tx, res) {

		    messageCnt = res.rows.length;
//			console.log("insertMessage: sqlInsert res.rows.length is " + res.rows.length);
		 });

		
		txn.executeSql(sqlQuery, [], function(tx, res) {

		    messageCnt = res.rows.length;
			console.log("executeSql: messageCnt is " + messageCnt);
			msgSearchArray = new Array();

		    for (i = 0; i < messageCnt; i ++){
		    	msgSearchArray[i] = {
			    			"id": res.rows.item(i).id,
			    			"content": res.rows.item(i).content,
			    			"pushtime": res.rows.item(i).pushtime,
			    			"read": res.rows.item(i).read,
				}
		    }
		    searchMessageCallback(msgSearchArray);
		 });
	});
}



//输入参数定义：
//var ids: [1,2,3,...];/*数组*/
//返回结果定义： 一共set read成功的记录数
//执行逻辑：
//传递一个ids数组作为参数，后台操作数据库把这些id对应的Message条目的read状态设置为已读.
//特别定义:全部置为已读时时传入参数ids = [-1]
function readMessage (ids,readMessageCallback) {

	console.log("database: readMessage " + ids);
		
	//UPDATE table_name SET column1=value1, column2=value2, ... WHERE some_column=some_value;
	var sqlReadMessage;
	if(ids == -1) {
		sqlReadMessage = "update message set read=1;";
	} else {
		sqlReadMessage = "update message set read=1 where id in (" + ids.join(',') + ");";
	}
	console.log(sqlReadMessage);
	
	var rowsAffected = 0;
	g_db.transaction( function (txn) {
		txn.executeSql(sqlReadMessage, [], function(tx, res) {
			
			rowsAffected = res.rowsAffected;
			console.log("@@@@@@@@@@@@@readMessage: rowsAffected=" + res.rowsAffected);
			//insertId：插入的行号； rowsAffected：影响的row数

//		    readMessageCallback(rowsAffected);
			readMessageCallback(ids);
		 });		
	});
	return rowsAffected;
}




//输入参数定义：
//var id: id;/*数字*/
//返回结果定义：
//message = {};/*参考message定义*/
//执行逻辑：
//list列表中点击某一消息，传递消息id给后台，后台实现方法查询数据库得到该id对应消息对象传递给前台并转发到view页面

var msgFind;
function findMessageById (id, findMessageByIdCallback) {
	console.log("database: findMessageById " + id);
	
	var sqlFindMessageById = "select * from message where id=" + id + ";";
	
	g_db.transaction( function (txn) {
		txn.executeSql(sqlFindMessageById, [], function(tx, res) {
   
			msgFind = {
	    			"id": res.rows.item(0).id,
	    			"content": res.rows.item(0).content,
	    			"pushtime": res.rows.item(0).pushtime,
	    			"read": res.rows.item(0).read,
	        };

	    	console.log("find findMessageById=" + id);
	    	console.log("content: " + msgFind.content);
	    	console.log("pushtime: " + msgFind.pushtime);
	    	console.log("read: " + msgFind.read);
	    	
	    	findMessageByIdCallback(msgFind);
	    	
		 });		
	});
    return msgFind;
}


//输入参数定义：
//var ids: [1,2,3,...];/*数组*/
//返回结果定义：
//flag = true;/*bool类型*/
//执行逻辑：
//传递一个ids数组作为参数，后台操作数据库把这些id对应的Message条目删掉，特别定义:全选删除时传入参数ids = [-1]，返回值为true表示操作成功。
function deleteMessageById (ids,deleteMessageCallback) {
	
	console.log("database: deleteMessageById " + ids);
	//DELETE FROM table_name WHERE [condition];

	var deleteCount = ids.length;
	var sqlDeleteMessage;
	    
	if(ids == -1) {
		
		sqlDeleteMessage = "delete from message;";
		
	} else 	{
		
		sqlDeleteMessage = "delete from message where id in (" + ids.join(',') + ");";
	}

	console.log(sqlDeleteMessage);
	
	g_db.transaction( function (txn) {
		txn.executeSql(sqlDeleteMessage, [], function(tx, res) {
			
			//insertId：插入的行号； rowsAffected：影响的row数
			if(ids != -1){
				console.log("@@@@@@@@@@@@@deleteMessageById " + deleteCount + " items, rowsAffected=" + res.rowsAffected);
			}else{
				console.log("@@@@@@@@@@@@@deleteMessageById all");
			}				
			deleteMessageCallback(ids);
		 });		
	});	
    return true;
}

function errorCB(err) {
    alert("Error processing SQL: " + err);
}

function getMaxID ( getMaxIDCallback ) {

	console.log("database: getMaxID");
		
	//UPDATE table_name SET column1=value1, column2=value2, ... WHERE some_column=some_value;
	var sqlMaxId = "select max(id) as maxid from message;";
	console.log(sqlMaxId);
	
	g_db.transaction( function (txn) {
		txn.executeSql(sqlMaxId, [], function(tx, res) {
			console.log("getMaxID return: " + res.rows.item(0).maxid); //column is 1
			getMaxIDCallback (res.rows.item(0).maxid);
		 });		
	});
	
	return true;
}


