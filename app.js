const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const imageRouter = require('./routes/image');
const testRouter = require('./routes/test');
const resultsRouter = require('./routes/results');
const thanksRouter = require('./routes/thanks');
const langRouter = require('./routes/lang');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser("test passed"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "test passed",
    saveUninitialized: true,
    resave: true,
}));

app.use('/', indexRouter);
app.use('/image', imageRouter);
app.use('/users', usersRouter);
app.use('/contribute', testRouter);
app.use('/results', resultsRouter);
app.use('/thanks', thanksRouter);
app.use('/lang', langRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
