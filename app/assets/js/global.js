var GLive = GLive || {
    Config: {
        domain: "live-pre.gaodun.com",
        // domain: "live-hz.gaodun.com",
        // domain: "live-t.gaodun.com",
        app: false
    }
};

// Common Methods.
(function () {
    if ((GLive.Methods !== undefined) && (GLive.Methods !== null)) {
        return;
    }

    GLive.Methods = {
        tips: function (info) {
            var div = document.createElement('div');
            div.className='classTip';
            var span = document.createElement('span');
            span.innerText = info;
            div.appendChild(span);
            document.getElementsByTagName('body')[0].appendChild(div);

            var height = div.clientHeight;
            var width = div.clientWidth;
            div.style.marginLeft = "-" + width / 2 + "px";
            div.style.marginTop = "-" + height / 2 + "px";
            setTimeout(function () {
                div.remove();
            }, 3000);

        },
        isValid: function (obj) {
            return (obj === undefined || obj === null) ? false : true;
        },
        n2s: function (n) {
            return (n >= 10) ? (n.toString()) : ("0" + n.toString());
        },
        formatTime: function (ms, date, time) {
            var n2s = function (n) {
                return (n >= 10) ? (n.toString()) : ("0" + n.toString());
            };

            var t = new Date(ms);

            var s = t.getFullYear() + "-" + n2s(t.getMonth() + 1) + "-" + n2s(t.getDate());
            if (date) {
                return s;
            }
            if (time) {
                return n2s(t.getHours()) + ":" + n2s(t.getMinutes());
            }
            return s + " " + n2s(t.getHours()) + ":" + n2s(t.getMinutes()); // + ":" + n2s(t.getSeconds());
        },
        sortArr: function (arr) {
            var temp;
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr.length - 1; j++) {
                    if (arr[j].startTime > arr[j + 1].startTime) {
                        temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            return arr;
        },
        // formatDuration: function(ms) {
        // 	var d = (new Date()).getTime() - ms;

        // 	var days = Math.floor(d / (24 * 60 * 60 * 1000));
        // 	if (days > 0) {
        // 		d -= days * 24 * 60 * 60 * 1000;
        // 	}

        // 	var hours = Math.floor(d / (60 * 60 * 1000));
        // 	if (hours > 0) {
        // 		d -= hours * 60 * 60 * 1000;
        // 	}

        // 	var minutes = Math.floor(d / (60 * 1000));
        // 	if (minutes > 0) {
        // 		d -= minutes * 60 * 1000;
        // 	}

        // 	var r = (hours >= 10 ? hours : ("0" + hours)) + ":" +
        // 		(minutes >= 10 ? minutes : ("0" + minutes)) + ":" +
        // 		(d >= 10 ? d : ("0" + d));

        // 	if (days > 0) {
        // 		return days + " " + r;
        // 	}

        // 	return r;
        // },
        formatDuration: function (seconds) {
            var d = seconds;

            var days = Math.floor(d / (24 * 60 * 60));
            if (days > 0) {
                d -= days * 24 * 60 * 60;
            }

            var hours = Math.floor(d / (60 * 60));
            if (hours > 0) {
                d -= hours * 60 * 60;
            }

            var minutes = Math.floor(d / 60);
            if (minutes > 0) {
                d -= minutes * 60;
            }

            var seconds = Math.floor(d);

            var r = (hours >= 10 ? hours : ("0" + hours)) + ":" +
                (minutes >= 10 ? minutes : ("0" + minutes)) + ":" +
                (seconds >= 10 ? seconds : ("0" + seconds));

            if (days > 0) {
                return days + " " + r;
            }

            return r;
        },
        convert: function (pageTemplate, timeStrict, askTemplate) {
            var n = pageTemplate;
            if (timeStrict === 1) {
                n |= 0x10;
            }
            if (askTemplate === 1) {
                n |= 0x20;
            }
            return n;
        },
        backConvert: function (num) {
            var pageTemplate = num & 0x0f;
            var timeStrict = ((num & 0x10) === 16) ? 1 : 0;
            var askTemplate = ((num & 0x20) === 32) ? 1 : 0;
            // console.log(pageTemplate, timeStrict, askTemplate);
            var arr = [pageTemplate, timeStrict, askTemplate];
            return arr;
        },
        getPlatformName: function (id) {
            switch (id) {
                case 0:
                    return "GLive";
                case 1:
                    return "Gensee";
                case 2:
                    return "BokeCC";
                case 3:
                    return "Mock";
                default:
                    return this.g.EN ? "Unknown" : "鏈煡";
            }
        },
        getMeetingTypeName: function (id) {
            switch (id) {
                case 0:
                    return "Live";
                case 1:
                    return "Live | Mock";
                case 2:
                    return "Mock";
                default:
                    return this.g.EN ? "Unknown" : "鏈煡";
            }
        },

        answerArray2HexString: function (arr) {
            if (!GLive.Methods.isValid(arr) || arr.length === 0) {
                return "";
            }

            var result = "";
            for (var i = 0; i < arr.length; i++) {
                var answer = arr[i];

                // Check the answer itself.
                if (!GLive.Methods.isValid(answer) || answer.length === 0) {
                    result += "00";
                    continue;
                }

                // Get its binary value.
                var b = 0x00;
                for (var j = 0; j < answer.length; j++) {
                    if (answer[j] !== '0') {
                        b |= (0x01 << j);
                    }
                }

                // Translate this byte to HEX string.
                var s = b.toString(16);
                if (s.length === 1) {
                    result += "0";
                }
                result += s;
            }
            return result;
        },
        md5: function (string) {
            var md5_RotateLeft = function (lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            };

            var md5_AddUnsigned = function (lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            };

            var md5_F = function (x, y, z) {
                return (x & y) | ((~x) & z);
            };

            var md5_G = function (x, y, z) {
                return (x & z) | (y & (~z));
            };

            var md5_H = function (x, y, z) {
                return (x ^ y ^ z);
            };

            var md5_I = function (x, y, z) {
                return (y ^ (x | (~z)));
            };

            var md5_FF = function (a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            var md5_GG = function (a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            var md5_HH = function (a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            var md5_II = function (a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            var md5_ConvertToWordArray = function (string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            var md5_WordToHex = function (lValue) {
                var WordToHexValue = "",
                    WordToHexValue_temp = "",
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            };

            var md5_Utf8Encode = function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };

            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22;
            var S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20;
            var S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23;
            var S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            string = md5_Utf8Encode(string);
            x = md5_ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = md5_AddUnsigned(a, AA);
                b = md5_AddUnsigned(b, BB);
                c = md5_AddUnsigned(c, CC);
                d = md5_AddUnsigned(d, DD);
            }
            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
        }
    };
})();

// (function () {
//     GLive.Methods.tips(navigator.userAgent);
//     if (navigator.userAgent.indexOf('vipcpa') > -1) {
//         GLive.Config.app = true;
//     }
//     // GLive.Methods.tips(GLive.Config.app);
// })();

// Data.
(function () {
    if (GLive.Methods.isValid(GLive.Data)) {
        return;
    }

    var storageKey = "GLiveData";

    // Data-related methods.
    GLive.Methods.initData = function (english) {
        GLive.Data = {
            COMPONENT: {
                UNKNOWN: 0,
                GROUP: 1,
                CLASS: 2,
                MEETING: 3,
                EXAM: 4,
                REPLAY: 5,
                SLIDES: 6,
                VIDEO: 7
            },

            // STORAGE: GLive.Methods.isValid(localStorage) ? true : false,
            EN: GLive.Methods.isValid(english) ? english : (navigator.language.indexOf("zh") === 0 ? false : true),

            me: {
                id: 0,
                nickname: "",
                role: ""
            },

            users: {},

            groups: [],
            // currentKlass: [], // Array of current class.
            classes: [], // Array of class objects within current group or paid list.

            meetings: [], // Array of meeting objects within current class.
            students: [], // Array of user IDs within current class.
            currentMeetingObj: {}, // obj of current meeting.
            progresses: {}, // Map from class ID to object of users' progresses.

            currentStudent: {}, // Map of current student.
            studentsNum: 0, // number fo students within current class.
            exam: {}, // Map of exam statistics
            timestamp: 0,

            currentGroup: 0,
            currentGroupName: "",
            currentClass: {},
            currentMeeting: 0,
            currentComponent: 0,
        };
    };
    GLive.Methods.saveData = function () {
        // if (GLive.Data.STORAGE !== true) {
        // return;
        // }
        localStorage.setItem(storageKey, JSON.stringify(GLive.Data));
    };
    GLive.Methods.loadData = function () {
        // if (!localStorage) {
        // return false;
        // }

        var s = localStorage.getItem(storageKey);
        if (s === null) {
            return false;
        }

        GLive.Data = eval("(" + s + ")");
        return true;
    };
    GLive.Methods.removeData = function () {
        var english = GLive.Data.EN;
        GLive.Methods.initData(english);
        localStorage.removeItem(storageKey);

        if (GLive.Data.STORAGE === true) {
            GLive.Methods.saveData();
        }
    };
    if (GLive.Config.app === false) {
        GLive.Methods.onXMLHttpError = function (n) {
            localStorage.clear();
            window.location.href = "#/login";
        };
    }
    // Try to load it from local storage.
    if (!GLive.Methods.loadData()) {
        // Clear everything.
        GLive.Methods.initData();
    }
})();
//APP request
// (function () {
//     var NativeHelper = {
//         id: 1,
//         m: {},
//         callback: function(id, s) {
//             if (!m[id]) {
//                 return;
//             }
//             var f = m[id];
//             if (typeof f !== "function") {
//                 return;
//             }
//
//             var obj = JSON.parse(s);
//             f(obj);
//         },
//         invoke: function(url, cb) {
//             m[id] = cb;
//             nativeInvoke(id, url);
//             id ++;
//         }
//     };
// window.NativeHelper = NativeHelper;
// })();
//end

// Request sender.
(function () {
    if (GLive.Methods.isValid(GLive.Sender)) {
        return;
    }
    //web request
    var RequestSender = {

        createNew: function (apiPrefix) {

            //web request
            var instance = {
                apiPrefix: apiPrefix,
                q: [],
                isWorking: false
            };

            instance.newInvocation = function (url, withSession, onSuccess) {
                GLive.Methods.tips('444444');
                instance.q.push({
                    json: true,
                    method: "POST",
                    url: instance.apiPrefix + url,
                    withSession: withSession,
                    data: null,
                    onSuccess: onSuccess,
                    onError: GLive.Methods.onXMLHttpError,
                    onOpened: null,
                    onProgress: null
                });

                startToWork();
            };

            instance.newUploading = function (url, file, onSuccess, onError, onOpened, onProgress) {
                var fileForm = new FormData();
                fileForm.append("file", file);

                instance.q.push({
                    json: false,
                    method: "POST",
                    url: instance.apiPrefix + url,
                    withSession: true,
                    data: fileForm,
                    onSuccess: onSuccess,
                    onError: onError,
                    onOpened: onOpened,
                    onProgress: onProgress
                });

                startToWork();
            };

            instance.newDownloading = function (url, onSuccess, onError) {
                instance.q.push({
                    json: false,
                    method: "GET",
                    url: url,
                    withSession: false,
                    data: null,
                    onSuccess: onSuccess,
                    onError: onError,
                    onOpened: null,
                    onProgress: null
                });

                startToWork();
            };

            instance.setTime = function (time) {
                localStorage.setItem("time", time);
            };
            instance.setID = function (id) {
                // if (localStorage) {
                localStorage.setItem("id", id);
                // } else {
                // 	var s = document.cookie;
                // 	if (s.length === 0) {
                // 		document.cookie = (id + "=");
                // 	} else {
                // 		document.cookie = (id + "=" + (s.split("="))[1]);
                // 	}
                // }
            };
            instance.getID = function () {
                // if (localStorage) {
                return localStorage.getItem("id");
                // } else {
                // 	var s = document.cookie;
                // 	if (s.length === 0) {
                // 		return "";
                // 	} else {
                // 		return (s.split("="))[0];
                // 	}
                // }
            };
            instance.setToken = function (token) {
                // if (localStorage) {
                localStorage.setItem("token", token);
                // } else {
                // 	var s = document.cookie;
                // 	if (s.length === 0) {
                // 		document.cookie = ("=" + token);
                // 	} else {
                // 		document.cookie = ((s.split("="))[0] + "=" + token);
                // 	}
                // }
            };
            instance.getToken = function () {
                // if (localStorage) {
                return localStorage.getItem("token");
                // } else {
                // 	var s = document.cookie;
                // 	if (s.length === 0) {
                // 		return "";
                // 	} else {
                // 		return (s.split("="))[1];
                // 	}
                // }
            };

            var startToWork = function () {
                if (instance.q.length === 0) {
                    return;
                }

                // Get a request for the queue.
                var r = instance.q[0];

                if (r.withSession === true) {
                    if (instance.isWorking === true) {
                        return;
                    } else {
                        instance.isWorking = true;
                    }
                }

                // Remove this request from the queue.
                instance.q.splice(0, 1);

                // Send it.
                request(
                    r.method,
                    r.url,
                    r.withSession,
                    r.data,
                    function (s) {
                        if ((r.onSuccess !== undefined) && (r.onSuccess !== null)) {
                            if (r.json === true) {
                                var obj = eval("(" + s + ")");
                                r.onSuccess(obj);
                            } else {
                                r.onSuccess(s);
                            }
                        }

                        // Process next request, if it exists.
                        if (r.withSession === true) {
                            instance.isWorking = false;
                        }
                        startToWork();
                    },
                    function (n) {
                        if ((r.onError !== undefined) && (r.onError !== null)) {
                            r.onError(n);
                        }

                        // Process next request, if it exists.
                        if (r.withSession === true) {
                            instance.isWorking = false;
                        }
                        startToWork();
                    },
                    r.onOpened,
                    r.onProgress
                );
            };

            var request = function (method, url, withSession, data, onSuccess, onError, onOpened, onProgress) {
                var xmlHttp = null;

                // Create an XML request.
                if (window.XMLHttpRequest) {
                    xmlHttp = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    try {
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {
                            xmlHttp = null;
                        }
                    }
                }

                // XML request is unsupported.
                if (xmlHttp === null) {
                    if ((onError !== undefined) && (onError !== null)) {
                        onError(0);
                    }
                }

                // Append session ID and token, if their are required.
                var s = url;
                if (withSession === true) {
                    var userID = instance.getID();
                    var token = instance.getToken();

                    if ((userID !== null) && (token !== null)) {
                        if (s.indexOf("?") >= 0) {
                            s += "&";
                        } else {
                            s += "?";
                        }
                        s += "session=" + userID + "&token=" + token;
                    }
                }

                // Set callbacks.
                xmlHttp.open(method, s, true);
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 1) {
                        // Invoke the callback function for onOpened event.
                        if ((onOpened !== undefined) && (onOpened !== null)) {
                            onOpened();
                        }
                        // Register the callback function for onProgress event.
                        if ((onProgress !== undefined) && (onProgress !== null)) {
                            xmlHttp.upload.onprogress = onProgress;
                        }
                    } else if (xmlHttp.readyState === 4) {
                        if (xmlHttp.status === 200) {
                            if (withSession === true) {
                                var token = xmlHttp.getResponseHeader("token");
                                if ((token !== undefined) && (token !== null) && (token !== "")) {
                                    instance.setToken(token);
                                }

                                var sLastDate = xmlHttp.getResponseHeader("date");
                                if ((sLastDate !== undefined) && (sLastDate !== null) && (sLastDate !== "")) {
                                    // GLive.Data.lastDate = new Date(sLastDate);
                                    GLive.Data.timestamp = (new Date(sLastDate)).getTime();
                                }
                            }

                            if ((onSuccess !== undefined) && (onSuccess !== null)) {
                                onSuccess(xmlHttp.responseText);
                            }
                        } else {
                            if ((onError !== undefined) && (onError !== null)) {
                                onError(xmlHttp.status);
                            }
                        }
                    }
                };

                // Send the request.
                xmlHttp.send(data);
            };

            return instance;
        }
    };

    GLive.Sender = RequestSender.createNew((!GLive.Methods.isValid(GLive.Config.domain) || GLive.Config.domain === "") ? "" : (window.location.protocol + "//" + GLive.Config.domain));
})();

// User-related methods.
(function () {
    if (GLive.Methods.isValid(GLive.User)) {
        return;
    }

    GLive.User = {
        register: function (userName, userPassword, token, onCallback) {
            GLive.Sender.newInvocation(
                "/user/register?name=" + encodeURIComponent(userName) + "&password=" + GLive.Methods.md5(userPassword) + "&token=" + encodeURIComponent(token),
                true,
                onCallback
            );
        },
        login: function (userName, userPassword, onCallback) {
            GLive.Sender.newInvocation(
                "/user/login?name=" + encodeURIComponent(userName) + "&password=" + GLive.Methods.md5(userPassword),
                true,
                function (resp) {
                    if (resp.status === 0) {
                        GLive.Data.me = resp.result;

                        GLive.Sender.setID(GLive.Data.me.id);
                        GLive.Methods.saveData();
                        onCallback(resp);
                        // Update groups.
                        // if (resp.result.role === "SYSTEM") {
                        // 	GLive.Group.query(function(resp) {
                        // 		if (resp.status !== 0 || GLive.Data.groups.length === 0) {
                        // 			if (GLive.Methods.isValid(onCallback)) {
                        // 				onCallback(resp);
                        // 			}
                        // 			return;
                        // 		}

                        // 		GLive.Data.currentGroupName = GLive.Data.groups[0].name;
                        // 		GLive.Data.currentGroup = GLive.Data.groups[0].id;
                        // 		GLive.Class.query(
                        // 			function(resp) {
                        // 				if (GLive.Methods.isValid(onCallback)) {
                        // 					onCallback(resp);
                        // 				}
                        // 			},
                        // 			GLive.Data.currentGroup
                        // 		);
                        // 	});
                        // } else {
                        // 	GLive.Class.query(
                        // 		function(resp) {
                        // 			if (GLive.Methods.isValid(onCallback)) {
                        // 				onCallback(resp);
                        // 			}
                        // 		},
                        // 		GLive.Data.currentGroup
                        // 	);
                        // }
                    } else {
                        if (GLive.Methods.isValid(onCallback)) {
                            onCallback(resp);
                        }
                    }
                }
            );
        },
        loginAsGaodunUser: function (userName, userPassword, onCallback, onError) {
            GLive.Sender.newInvocation(
                "/gaodun/login?name=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(userPassword),
                true,
                function (resp) {
                    if (resp.status === 0) {
                        // Update groups.
                        GLive.Data.me.role = "STUDENT";
                        GLive.Data.me = resp.result;
                        GLive.Sender.setID(resp.result.id);
                        onCallback(resp);
                        // GLive.queryClass(
                        // 	function (resp) {
                        // 		if (GLive.isFunction(onCallback)) {
                        // 			onCallback(resp);
                        // 		}
                        // 	}
                        // );
                    }
                },
                onError
            );
        },
        loginAsGaodunStudent: function (password, onCallback) {
            GLive.Sender.newInvocation(
                "/gaodun/pass?password=" + password,
                true,
                function (resp) {
                    if (resp.status === 0) {
                        GLive.Data.me.id = resp.result.id;
                        GLive.Data.me.nickname = resp.result.nickname;
                        GLive.Data.me.role = "STUDENT";
                        GLive.Data.currentClass = resp.result.class;

                        GLive.Sender.setID(GLive.Data.me.id);

                        GLive.Sender.newInvocation(
                            "/class/meeting/query?class=" + resp.result.class,
                            true,
                            onCallback
                        );
                    } else {
                        if (GLive.Methods.isValid(onCallback)) {
                            onCallback(resp);
                        }
                    }
                }
            );
        },
        logout: function (onCallback) {
            GLive.Methods.removeData();

            GLive.Sender.setID("");
            GLive.Sender.setToken("");

            if (GLive.Methods.isValid(onCallback)) {
                onCallback(resp);
            }
            ;

            window.location.reload();
        },
        changePassword: function (oldPassword, newPassword, onCallback) {
            GLive.Sender.newInvocation(
                "/user/password/change?oldPassword=" + GLive.Methods.md5(oldPassword) + "&password=" + GLive.Methods.md5(newPassword),
                true,
                onCallback
            );
        },
        changeProfile: function (nickname, mail, phone, qq, onCallback) {
            GLive.Sender.newInvocation(
                "/user/profile/change?nickname=" + encodeURIComponent(nickname) + "&mail=" + encodeURIComponent(mail) + "&phone=" + encodeURIComponent(phone) + "&qq=" + encodeURIComponent(qq),
                true,
                function (resp) {
                    if (resp.status === 0) {
                        GLive.Data.me.nickname = nickname;
                        GLive.Methods.saveData();
                    }
                    if (GLive.Methods.isValid(onCallback)) {
                        onCallback(resp);
                    }
                }
            );
        },
        remark: function (remark, userID, classID, name, type, onCallback) {
            var params = "";
            if (type === 0) {
                params = "&student=";
            } else {
                params = "&teacher=";
            }
            GLive.Sender.newInvocation(
                "/class/student/remark?remark=" + encodeURIComponent(remark) + params + userID + "&class=" + classID + "&name=" + name,
                true,
                onCallback
            );
        },
        queryGaodunStudentInfo: function (gaodunStudentID, onCallback) {
            GLive.Sender.newInvocation(
                "/gaodun/student/info/query?id=" + gaodunStudentID,
                true,
                onCallback
            );
        },
    };
})();


// Group-related methods.
(function () {
    if (GLive.Methods.isValid(GLive.Group)) {
        return;
    }

    GLive.Group = {
        query: function (onCallback) {
            GLive.Sender.newInvocation(
                "/user/group/query",
                true,
                function (resp) {
                    if (resp.status === 0) {
                        GLive.Data.groups = resp.result.group;
                        // GLive.Data.currentComponent = GLive.Data.COMPONENT.CLASS;
                        // GLive.Methods.saveData();
                    }
                    if (GLive.Methods.isValid(onCallback)) {
                        onCallback(resp);
                    }
                    ;
                }
            );
        },
        // 查询科目
        querySubject: function (onCallback) {
            GLive.Sender.newInvocation(
                "/subject/query",
                true,
                onCallback
            );
        },
        querySubjectForGroup: function (groupID, onCallback) {
            var s = "/group/subject/query";
            if (groupID) {
                s += "?group=" + groupID;
            }

            GLive.Sender.newInvocation(s, true, onCallback);
        },
        // 标签
        // 查询
        queryTag: function (groupID, onCallback) {
            GLive.Sender.newInvocation(
                "/tag/query?group=" + groupID,
                true,
                onCallback
            );
        }
    };
})();

// Class-related methods.
(function () {
    if (GLive.Methods.isValid(GLive.Class)) {
        return;
    }

    GLive.Class = {
        getOneClass: function (classID, onCallback) {
            GLive.Sender.newInvocation(
                "/class/get?class=" + classID,
                true,
                onCallback
            );
        },
        query: function (onCallback, groupID) {
            var params = "";
            if (GLive.Data.me.role === "SYSTEM") {
                params += "?group=" + groupID;
            }
            GLive.Sender.newInvocation(
                "/class/query" + params,
                true,
                function (resp) {
                    if (resp.status === 0) {
                        GLive.Data.classes = resp.result.classList;
                        GLive.Data.currentGroup = groupID;
                        GLive.Data.currentComponent = GLive.Data.COMPONENT.CLASS;
                        GLive.Methods.saveData();
                    }
                    if (GLive.Methods.isValid(onCallback)) {
                        onCallback(resp);
                    }
                    ;
                }
            );
        },
        //获取班级笔记
        getNote: function (classID, onCallback) {
            GLive.Sender.newInvocation(
                "/note/get?class=" + classID,
                true,
                onCallback
            );
        },
        // 获取班级所有问题
        issueGet: function (classID, onCallback) {
            GLive.Sender.newInvocation(
                "/class/issue/get?class=" + classID,
                true,
                onCallback
            );
        },

        // 回答问题
        answerIssue: function (classID, issueID, answer, onCallback) {
            answer = encodeURIComponent(LZString.compressToBase64(answer));
            GLive.Sender.newInvocation(
                "/class/issue/answer?class=" + classID + "&issue=" + issueID + "&answer=" + answer,
                true,
                onCallback
            );
        },
        getBooking: function (subject, groupID, onCallback) {
            GLive.Sender.newInvocation(
                "/booking/get?subject=" + subject + "&group=" + groupID,
                true,
                onCallback
            );
        },
    };
})();

// Meeting-related methods.
(function () {
    if (GLive.Methods.isValid(GLive.Meeting)) {
        return;
    }

    GLive.Meeting = {
        getOneMeeting: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/get?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        queryByClass: function (classID, onCallback) {
            GLive.Sender.newInvocation(
                "/class/meeting/query?class=" + classID,
                true,
                onCallback
                // function(resp) {
                // 	if (resp.status === 0) {
                // 		// GLive.Data.currentClass = classID;
                // 		// GLive.Data.meetings = resp.result.meeting;
                // 		// GLive.Data.currentComponent = GLive.Data.COMPONENT.MEETING;

                // 		// GLive.Methods.saveData();
                // 	}

                // 	if (GLive.Methods.isValid(onCallback)) {
                // 		onCallback(resp);
                // 	}
                // }
            );
        },
        authorizeVideos: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/video/authorize?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        authorizeReplays: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/replay/authorize?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        resyncExam: function (meetingID, examID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/exam/resync?meeting=" + meetingID + "&exam=" + examID,
                true,
                onCallback
                // function(resp) {
                // 	if (resp.status === 0) {
                // 		GLive.Meeting.queryByClass(GLive.Data.currentClass, onCallback);
                // 	} else {
                // 		if (GLive.Methods.isValid(onCallback)) {
                // 			onCallback(resp);
                // 		}
                // 	}
                // }
            );
        },
        // 获取每节课某一试卷  所有学员的答案
        queryExamAnswer: function (meetingID, examID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/exam/answer/get?meeting=" + meetingID + "&exam=" + examID,
                true,
                onCallback
            );
        },

        askForLeave: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/leave?meeting=" + meetingID + "&cancel=0",
                true,
                onCallback
            );
        },
        cancelLeave: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/leave?meeting=" + meetingID + "&cancel=1",
                true,
                onCallback
            );
        },
        join: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/join?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        // get feedback
        getFeedback: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/feedback/get?meeting=" + meetingID,
                true,
                onCallback
            );
        }
    };
})();

// Student-related methods.
(function () {
    if (GLive.Methods.isValid(GLive.Student)) {
        return;
    }

    GLive.Student = {
        queryByClass: function (classID, onCallback) {
            GLive.Sender.newInvocation(
                "/class/student/query?class=" + classID,
                true,
                function (resp) {
                    if (resp.status === 0) {
                        GLive.Data.students = [];
                        for (var userID in resp.result.user) {
                            GLive.Data.students.push({
                                id: userID,
                                nickname: resp.result.user[userID].nickname,
                                gaodunStudentID: GLive.Methods.isValid(resp.result.user[userID].gaodunStudentID) ? resp.result.user[userID].gaodunStudentID : 0,
                                remark: resp.result.user[userID].remark
                            });
                        }
                    }
                    if (GLive.Methods.isValid(onCallback)) {
                        onCallback(resp);
                    }
                }
            );
        },
    };
})();

// Progress-related methods.
(function () {
    if (GLive.Methods.isValid(GLive.Progress)) {
        return;
    }

    GLive.Progress = {
        queryByClassAndUser: function (classID, userID, onCallback) {
            GLive.Sender.newInvocation(
                "/class/progress/query?class=" + classID + "&user=" + userID,
                true,
                onCallback
            );
        },
        queryByMeeting: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/progress/query?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        queryMineByClass: function (classID, onCallback) {
            GLive.Sender.newInvocation(
                "/class/progress/query?class=" + classID,
                true,
                onCallback
            );
        },
        queryMineByMeeting: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/progress/query?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        finishCourseware: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/courseware/finish?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        finishVideo: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/video/finish?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        finishMeeting: function (meetingID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/finish?meeting=" + meetingID,
                true,
                onCallback
            );
        },
        authorizeExam: function (meetingID, examID, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/exam/authorize?meeting=" + meetingID + "&exam=" + examID,
                true,
                onCallback
            );
        },
        answerExam: function (meetingID, examID, answer, onCallback) {
            GLive.Sender.newInvocation(
                "/meeting/exam/answer?meeting=" + meetingID + "&exam=" + examID + "&answer=" + answer,
                true,
                onCallback
            );
        },
        summarizeProgressOfClass: function (classID, onCallback) {
            // Get all meetings within this class.
            GLive.Meeting.queryByClass(
                classID,
                function (resp) {
                    // Check status code.
                    if (resp.status !== 0) {
                        if (GLive.Methods.isValid(onCallback)) {
                            onCallback(resp);
                        }
                        return;
                    }

                    // Arrange meetings according to their start time.
                    resp.result.meeting.sort(function (a, b) {
                        return a.startTime - b.startTime;
                    });

                    // Select valid meetings.
                    var meetings = [];
                    var now = (new Date()).getTime();
                    for (var i = 0; i < resp.result.meeting.length; i++) {
                        // Get the meeting itself.
                        var m = resp.result.meeting[i];

                        // Ignore invalid meetings.
                        if (!GLive.Methods.isValid(m)) {
                            continue;
                        }

                        // Ignore meetings whose start time is after now.
                        if (m.startTime > now) {
                            break;
                        }

                        // Record this meeting.
                        meetings.push(m);
                    }

                    // Get overall progress of each meeting, respectively.
                    var result = {};
                    for (var i = 0; i < meetings.length; i++) {
                        // Get the meeting itself.
                        let index = i;
                        let m = meetings[i];

                        // Ignore invalid meetings.
                        if (!GLive.Methods.isValid(m)) {
                            continue;
                        }
                        // Ignore meetings whose start time is after now.
                        if (m.startTime > now) {
                            break;
                        }

                        // Get students' progresses of this meeting.
                        GLive.Progress.queryByMeeting(
                            m.id,
                            function (resp) {
                                // Check status code.
                                if (resp.status !== 0) {
                                    // TODO:
                                    // if (GLive.Methods.isValid(onCallback)) {
                                    // 	onCallback(resp);
                                    // }
                                    return;
                                }

                                for (var j = 0; j < resp.result.progress.length; j++) {
                                    // Get a student's progress.
                                    var p = resp.result.progress[j];

                                    // Get user ID of this student.
                                    if (!GLive.Methods.isValid(result[p.userID])) {
                                        // Initiate an array for this student.
                                        result[p.userID] = [];
                                    }

                                    // Append to the array.
                                    result[p.userID].push(p);
                                }

                                if (index === meetings.length - 1) { // This is the last meeting.
                                    GLive.Data.progresses[classID] = result;
                                    GLive.Methods.saveData();

                                    if (GLive.Methods.isValid(onCallback)) {
                                        onCallback({
                                            status: 0,
                                            info: "Okay.",
                                            result: result
                                        });
                                    }
                                }
                            }
                        );
                    }
                }
            );
        },
    };
})();
window.GLive = GLive;