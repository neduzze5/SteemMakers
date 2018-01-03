// REQUIREMENTS: 
// nodeJS: https://nodejs.org
// steem-js: npm install steem --save
// mysql: npm install mysql

var mysql = require('mysql');
var steem = require('steem');
var fs = require('fs');

var config;
var mysqlConnection;

function createComment(id, author, permlink)
{
    var commentPermlink = steem.formatter.commentPermlink(author, permlink);
    body = "Congratulations! This post has been upvoted by SteemMakers. We are a community based project that aims to support makers and DIYers on the blockchain in every way possible. Find out more about us on our website: [www.steemmakers.com](www.steemmakers.com). <br/><br/>If you like our work, please consider upvoting this comment to support the growth of our community. Thank you.";

    var wif = steem.auth.toWif(config.votingAccount, config.votingAccountPW, 'posting');

    steem.broadcast.comment(wif,  author, permlink, config.votingAccount, commentPermlink, "", body, "", function(err, result)
    {
        if(!err && result)
        {
            console.log("Successful commented on id " + id);
           
            var query = 'UPDATE approved_posts SET commented_on = NOW() WHERE id=?';
                        
            mysqlConnection.query(query,[id], function (error, result, rows, fields)
            {
                if(!err && result)
                {
                    console.log("Added commenting time to database for id " + id); 
                }
                else
                {
                    console.log("Failed to add commenting time to database for id " + id); 
                }
            });
        }
        else
        {
            console.log("Failed to comment on id " + id);
        }
    });
}

function createVote(id, author, permlink)
{
    var commentPermlink = steem.formatter.commentPermlink(author, permlink);
 
    var wif = steem.auth.toWif(config.votingAccount, config.votingAccountPW, 'posting');

    steem.broadcast.vote(wif, config.votingAccount, author, permlink, 10000, function(err, result)
    {
        if(!err && result)
        {
            console.log("Successfully voted on id " + id);

            var query = 'UPDATE approved_posts SET voted_on = NOW() WHERE id=?';
                        
            mysqlConnection.query(query,[id], function (error, result, rows, fields)
            {
                if(!err && result)
                {
                    console.log("Added voting time to database for id " + id); 
                }
                else
                {
                    console.log("Failed to add voting time to database for id " + id); 
                }
            });
        }
        else
        {
            console.log("Failed to vote on id " + id);
        }
    });
}

function main()
{
    config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

    mysqlConnection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    });

    mysqlConnection.connect(function(error)
    {
        if (error)
        {
            console.log("Failed to connect to database");
            throw error;
        }
        else
        {
            console.log("Connected to database!");

            mysqlConnection.query("SELECT approved_posts.id, name AS author_name, permlink FROM approved_posts JOIN users ON approved_posts.author_id = users.id WHERE (approved_posts.commented_on IS NULL AND approved_posts.commented_on IS NULL)", function (error, rows, fields)
            {
                if (error)
                {
                    console.log("Failed to query approved posts");
                    throw error;
                }
                else
                {
                    console.log(rows.length + " entries need voting and commenting");
                    for (i = 0; i < rows.length; i++)
                    {
                        console.log("Entry " + i + ": id=" + rows[i].id + ", author name=" + rows[i].author_name + ", permlink=" + rows[i].permlink);
                        createComment(rows[i].id, rows[i].author_name, rows[i].permlink);
                        createVote(rows[i].id, rows[i].author_name, rows[i].permlink);
                    };
                }
            });
        }
    });
}

main();