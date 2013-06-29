/*
 * __________________________________ir.js__________________________________
 *
 * ir.js is a javascript library for information retrieval.
 *
 * You can get more details in ir page >> www.rademas.com/jstore
 *
 * Licensed under the MIT license.
 *
 * Copyright (c) 2012-2013 Rademas Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
(function () {
    //'hi there how are you hi hi hi?'.match(/\bhi\b/g).length;
    /*
     var str1='hi there how are you hi hi hi?';
     var str2= 'hi';
     var regex = new RegExp("\\b"+str2+"\\b","g");
     str1.match(regex).length;
     */
    var ir_documents = [];

    var stopWords_common = [{"word":"a"},{"word":"an"},{"word":"and"},{"word":"are"},
        {"word":"as"},{"word":"at"},{"word":"be"},{"word":"by"},{"word":"for"},
        {"word":"from"},{"word":"has"},{"word":"he"},{"word":"in"},{"word":"is"},
        {"word":"it"},{"word":"its"},{"word":"of"},{"word":"on"},{"word":"that"},
        {"word":"the"},{"word":"to"},{"word":"was"},{"word":"were"},{"word":"will"},
        {"word":"with"}];


    function initialize_() {

    }

    //document : [{"doc":"this is the document"},{"doc":"this is the next document"}]
    function calcTermFrequency_(documents, query){
        var terms = getTermsFromQuery_(query);
        var ir_tf =[];

        for (var i=0;i< documents.length;i++){
            var docObj ={};
            for(var j=0; j<terms.length;j++){
                var termc= getTermCount_(documents[i].doc,terms[j]);
                docObj[terms[j]]=termc;
            }
            ir_tf.push(docObj);
        }
        return ir_tf;
    }

    function calcDocumentFrequency_(documents, query){
        var terms = getTermsFromQuery_(query);
        var ir_df=[];

        for (var i=0;i<terms.length;i++){
            var termObj ={};
            var count =0;
            for(var j=0;j<documents.length;j++){
                if(searchTermInDocument_(documents[j].doc,terms[i])>-1){
                    count=count+1;
                }
            }
            termObj[terms[i]]=count;
            ir_df.push(termObj);
        }

        return ir_df;
    }

    function calcInverseDocumentFrequency_(documents, query){
        var docfreqs=  calcDocumentFrequency_(documents, query);
        var terms = getTermsFromQuery_(query);
        var totalDoc = documents.length;
        var ir_idf=[];

        for(var i =0; i<docfreqs.length;i++){
            var freqCount = Number(docfreqs[i][terms[i]]);
            var idfObj={};

            if(freqCount===0){
                freqCount = freqCount+1;
            }

            freqCount = Math.log(totalDoc/freqCount)/Math.LN10;
            idfObj[terms[i]]=freqCount.toFixed(3);
            ir_idf.push(idfObj);
        }

        return ir_idf;

    }

    function calcTfIdf_(documents, query){
        var terms = getTermsFromQuery_(query);
        var tf = calcTermFrequency_(documents, query);
        var idf = calcInverseDocumentFrequency_(documents, query);
        var ir_tfidf=[];

        for (var i=0;i<documents.length;i++){
            var tfidfObj={};
            var tfidfscore =0;

            for(var j=0;j<terms.length;j++){
                var tfscore= tf[i][terms[j]];
                var idfscore= idf[j][terms[j]];
                tfidfscore = tfidfscore + (tfscore *  idfscore);
            }
            tfidfObj["tfidf"]= tfidfscore;
            ir_tfidf.push(tfidfObj);
        }

        return ir_tfidf;

    }

    function searchTermInDocument_(doc, term){
        var regex = new RegExp("\\b"+term+"\\b","g");
        var n=doc.search(regex);
        return n;

    }

    function getTermCount_(doc, term){
        var regex = new RegExp("\\b"+term+"\\b","g");
        var matchedElements=doc.match(regex);
        if(matchedElements !== null) {
            return matchedElements.length;
        }
        return 0;
    }
    function getTermsFromQuery_(query){
        var terms=query.split(" ");
        return terms;
    }
    function stopWordFilter_(query){


        return undefined;

    }

    ir = {
        //document : [{"doc":"this is the document"},{"doc":"this is the next document"}]
        //query : string

        Documents: function(){
            this.docs = [];
            this.add = function(text){
                var docObj = {};
                docObj["doc"]=text;
                this.docs.push(docObj);
            }
        },


        tf: function (documents, query) {
            return calcTermFrequency_(documents.docs,query);

        },
        idf: function (documents, query) {
            return calcInverseDocumentFrequency_(documents.docs,query);

        },
        tfidf: function (documents, query) {
            return calcTfIdf_(documents.docs, query);

        },
        filterStopWords: function (query, level) {
            level = level || 1;

        },
        booleanRetrieval: function (documents, query){

        },

        tokenize: function(document){

        },

        zipfLaw: function(documents,term){

        },

        zoneScore: function(documents, term){

        }
    }

})();