
$(document).ready(function(){



const categories = 

[
  {
    "id": 75,
    "name": "Doctor",
    "logo": "doctor.png",
    "seo_name": "doctor",
   
  },
  {
    "id": 58,
    "name": "Fitness",
    "logo": "fitness.png",
    "seo_name": "fitness",
   
  },
  {
    "id": 57,
    "name": "Physiotherapist",
    "logo": "physiotherapy.png",
    "seo_name": "physiotherapist",
   
  },
  {
    "id": 61,
    "name": "Salon",
    "logo": "saloon.png",
    "seo_name": "salon",
   
  },
  {
    "id": 51,
    "name": "Yoga",
    "logo": "yoga.png",
    "seo_name": "yoga",
   
  }
]






const cities = // 20200822111907
// http://localhost:4000/category/city

[
  {
    "name": "Delhi",
    "id": 1
  },
  {
    "name": "Noida",
    "id": 2
  },
  {
    "name": "Ahmedabad",
    "id": 3
  },
  {
    "name": "Bangalore",
    "id": 4
  },
  {
    "name": "Chandigarh",
    "id": 5
  },
  {
    "name": "Chennai",
    "id": 6
  },
  {
    "name": "Goa",
    "id": 7
  },
  {
    "name": "Coimbatore",
    "id": 8
  },
  {
    "name": "Gurugram",
    "id": 9
  },
  {
    "name": "Hyderabad",
    "id": 10
  },
  {
    "name": "Indore",
    "id": 11
  },
  {
    "name": "Jaipur",
    "id": 12
  },
  {
    "name": "Kolkata",
    "id": 13
  },
  {
    "name": "Mumbai",
    "id": 14
  },
  {
    "name": "Pune",
    "id": 15
  },
  {
    "name": "Vijayawada",
    "id": 16
  },
  {
    "name": "Navi Mumbai",
    "id": 17
  },
  {
    "name": "Trivandrum",
    "id": 18
  },
  {
    "name": "Nellore",
    "id": 19
  },
  {
    "name": "Kakinada",
    "id": 20
  },
  {
    "name": "Rajahmundry",
    "id": 21
  },
  {
    "name": "Tirupati",
    "id": 22
  },
  {
    "name": "Kadapa",
    "id": 23
  },
  {
    "name": "Kurnool",
    "id": 25
  },
  {
    "name": "Eluru",
    "id": 26
  },
  {
    "name": "Anantapur",
    "id": 27
  },
  {
    "name": "Vijayanagaram",
    "id": 28
  },
  {
    "name": "Tenali",
    "id": 29
  },
  {
    "name": "Ongole",
    "id": 30
  },
  {
    "name": "Nandyal",
    "id": 31
  },
  {
    "name": "Chittoor",
    "id": 32
  },
  {
    "name": "Machilipatnam",
    "id": 33
  },
  {
    "name": "Adoni",
    "id": 34
  },
  {
    "name": "Proddatur",
    "id": 35
  },
  {
    "name": "Hindupur",
    "id": 36
  },
  {
    "name": "Bhimavaram",
    "id": 37
  },
  {
    "name": "Madanapalle",
    "id": 38
  },
  {
    "name": "Guntakal",
    "id": 39
  },
  {
    "name": "Srikakulam",
    "id": 40
  },
  {
    "name": "Dharmavaram",
    "id": 41
  },
  {
    "name": "Gudivada",
    "id": 42
  },
  {
    "name": "Narasaraopet",
    "id": 43
  },
  {
    "name": "Tadipatri",
    "id": 44
  },
  {
    "name": "Kavali",
    "id": 45
  },
  {
    "name": "Tadepalligudem",
    "id": 46
  },
  {
    "name": "Amaravati",
    "id": 47
  },
  {
    "name": "Guwahati",
    "id": 48
  },
  {
    "name": "Patna",
    "id": 49
  },
  {
    "name": "Gaya",
    "id": 50
  },
  {
    "name": "Bhagalpur",
    "id": 51
  },
  {
    "name": "Muzaffarpur",
    "id": 52
  },
  {
    "name": "Bihar Sharif",
    "id": 53
  },
  {
    "name": "Darbhanga",
    "id": 54
  },
  {
    "name": "Purnia",
    "id": 55
  },
  {
    "name": "Arrah",
    "id": 56
  },
  {
    "name": "Begusarai",
    "id": 57
  },
  {
    "name": "Munger",
    "id": 58
  },
  {
    "name": "Chapra",
    "id": 59
  },
  {
    "name": "Danapur",
    "id": 60
  },
  {
    "name": "Katihar",
    "id": 61
  },
  {
    "name": "Saharsa",
    "id": 62
  },
  {
    "name": "Sasaram",
    "id": 63
  },
  {
    "name": "Hajipur",
    "id": 64
  },
  {
    "name": "Dehri",
    "id": 65
  },
  {
    "name": "Siwan",
    "id": 66
  },
  {
    "name": "Bettiah",
    "id": 67
  },
  {
    "name": "Motihari",
    "id": 68
  },
  {
    "name": "Kishanganj",
    "id": 69
  },
  {
    "name": "Jamalpur",
    "id": 70
  },
  {
    "name": "Buxar",
    "id": 71
  },
  {
    "name": "Jehanabad",
    "id": 72
  },
  {
    "name": "Aurangabad",
    "id": 73
  },
  {
    "name": "Chandigarh",
    "id": 74
  },
  {
    "name": "Raipur",
    "id": 75
  },
  {
    "name": "Bhilai",
    "id": 76
  },
  {
    "name": "Korba",
    "id": 77
  },
  {
    "name": "Bilaspur",
    "id": 78
  },
  {
    "name": "Durg",
    "id": 79
  },
  {
    "name": "Surat",
    "id": 80
  },
  {
    "name": "Vadodara",
    "id": 81
  },
  {
    "name": "Rajkot",
    "id": 82
  },
  {
    "name": "Bhavnagar",
    "id": 83
  },
  {
    "name": "Jamnagar",
    "id": 84
  },
  {
    "name": "Junagadh",
    "id": 85
  },
  {
    "name": "Gandhidham",
    "id": 86
  },
  {
    "name": "Nadiad",
    "id": 87
  },
  {
    "name": "Gandhinagar",
    "id": 88
  },
  {
    "name": "Anand",
    "id": 89
  },
  {
    "name": "Morbi",
    "id": 90
  },
  {
    "name": "Mehsana",
    "id": 91
  },
  {
    "name": "Surendranagar Dudhrej",
    "id": 92
  },
  {
    "name": "Faridabad",
    "id": 93
  },
  {
    "name": "Gurgaon",
    "id": 94
  },
  {
    "name": "Rohtak",
    "id": 95
  },
  {
    "name": "Panipat",
    "id": 96
  },
  {
    "name": "Karnal",
    "id": 97
  },
  {
    "name": "Sonipat",
    "id": 98
  },
  {
    "name": "Yamunanagar",
    "id": 99
  },
  {
    "name": "Panchkula",
    "id": 100
  },
  {
    "name": "Bhiwani",
    "id": 101
  },
  {
    "name": "Ambala",
    "id": 102
  },
  {
    "name": "Sirsa",
    "id": 103
  },
  {
    "name": "Shimla",
    "id": 104
  },
  {
    "name": "Jammu",
    "id": 105
  },
  {
    "name": "Srinagar",
    "id": 106
  },
  {
    "name": "Dhanbad",
    "id": 107
  },
  {
    "name": "Ranchi",
    "id": 108
  },
  {
    "name": "Jamshedpur",
    "id": 109
  },
  {
    "name": "Bokaro",
    "id": 110
  },
  {
    "name": "Mango",
    "id": 111
  },
  {
    "name": "Deoghar",
    "id": 112
  },
  {
    "name": "Bangalore",
    "id": 113
  },
  {
    "name": "Hubli Dharwad",
    "id": 114
  },
  {
    "name": "Mysore",
    "id": 115
  },
  {
    "name": "Gulbarga",
    "id": 116
  },
  {
    "name": "Mangalore",
    "id": 117
  },
  {
    "name": "Belgaum",
    "id": 118
  },
  {
    "name": "Davanagere",
    "id": 119
  },
  {
    "name": "Bellary",
    "id": 120
  },
  {
    "name": "Shimoga",
    "id": 121
  },
  {
    "name": "Tumkur",
    "id": 122
  },
  {
    "name": "Raichur",
    "id": 123
  },
  {
    "name": "Bidar",
    "id": 124
  },
  {
    "name": "Hospet",
    "id": 125
  },
  {
    "name": "Udupi",
    "id": 126
  },
  {
    "name": "Kochi",
    "id": 127
  },
  {
    "name": "Thiruvananthapuram",
    "id": 128
  },
  {
    "name": "Kozhikode",
    "id": 129
  },
  {
    "name": "Kollam",
    "id": 130
  },
  {
    "name": "Thrissur",
    "id": 131
  },
  {
    "name": "Alappuzha",
    "id": 132
  },
  {
    "name": "Kottayam",
    "id": 133
  },
  {
    "name": "Bhopal",
    "id": 134
  },
  {
    "name": "Indore",
    "id": 135
  },
  {
    "name": "Gwalior",
    "id": 136
  },
  {
    "name": "Jabalpur",
    "id": 137
  },
  {
    "name": "Ujjain",
    "id": 138
  },
  {
    "name": "Sagar",
    "id": 139
  },
  {
    "name": "Dewas",
    "id": 140
  },
  {
    "name": "Satna",
    "id": 141
  },
  {
    "name": "Ratlam",
    "id": 142
  },
  {
    "name": "Rewa",
    "id": 143
  },
  {
    "name": "Katni",
    "id": 144
  },
  {
    "name": "Singrauli",
    "id": 145
  },
  {
    "name": "Burhanpur",
    "id": 146
  },
  {
    "name": "Khandwa",
    "id": 147
  },
  {
    "name": "Morena",
    "id": 148
  },
  {
    "name": "Bhind",
    "id": 149
  },
  {
    "name": "Guna",
    "id": 150
  },
  {
    "name": "Shivpuri",
    "id": 151
  },
  {
    "name": "Mumbai",
    "id": 152
  },
  {
    "name": "Pune",
    "id": 153
  },
  {
    "name": "Nagpur",
    "id": 154
  },
  {
    "name": "Thane",
    "id": 155
  },
  {
    "name": "Pimpri-Chinchwad",
    "id": 156
  },
  {
    "name": "Nashik",
    "id": 157
  },
  {
    "name": "Kalyan-Dombivli",
    "id": 158
  },
  {
    "name": "Vasai-Virar",
    "id": 159
  },
  {
    "name": "Aurangabad",
    "id": 160
  },
  {
    "name": "Navi Mumbai",
    "id": 161
  },
  {
    "name": "Solapur",
    "id": 162
  },
  {
    "name": "Mira-Bhayandar",
    "id": 163
  },
  {
    "name": "Jalgaon",
    "id": 164
  },
  {
    "name": "Bhiwandi",
    "id": 165
  },
  {
    "name": "Amravati",
    "id": 166
  },
  {
    "name": "Nanded",
    "id": 167
  },
  {
    "name": "Kolhapur",
    "id": 168
  },
  {
    "name": "Akola",
    "id": 169
  },
  {
    "name": "Ulhasnagar",
    "id": 170
  },
  {
    "name": "Sangli-Miraj & Kupwad",
    "id": 171
  },
  {
    "name": "Malegaon",
    "id": 172
  },
  {
    "name": "Latur",
    "id": 173
  },
  {
    "name": "Dhule",
    "id": 174
  },
  {
    "name": "Ahmednagar",
    "id": 175
  },
  {
    "name": "Satara",
    "id": 176
  },
  {
    "name": "Chandrapur",
    "id": 177
  },
  {
    "name": "Parbhani",
    "id": 178
  },
  {
    "name": "Ichalkaranji",
    "id": 179
  },
  {
    "name": "Jalna",
    "id": 180
  },
  {
    "name": "Ambarnath",
    "id": 181
  },
  {
    "name": "Bhusawal",
    "id": 182
  },
  {
    "name": "Panvel",
    "id": 183
  },
  {
    "name": "Imphal",
    "id": 184
  },
  {
    "name": "Mizoram",
    "id": 185
  },
  {
    "name": "Aizawl",
    "id": 186
  },
  {
    "name": "Odisha",
    "id": 187
  },
  {
    "name": "Bhubaneswar",
    "id": 188
  },
  {
    "name": "Cuttack",
    "id": 189
  },
  {
    "name": "Rourkela",
    "id": 190
  },
  {
    "name": "Berhampur",
    "id": 191
  },
  {
    "name": "Sambalpur",
    "id": 192
  },
  {
    "name": "Raurkela Industrial Township",
    "id": 193
  },
  {
    "name": "Ozhukarai",
    "id": 194
  },
  {
    "name": "Pondicherry",
    "id": 195
  },
  {
    "name": "Ludhiana",
    "id": 196
  },
  {
    "name": "Ludhiana",
    "id": 197
  },
  {
    "name": "Amritsar",
    "id": 198
  },
  {
    "name": "Jalandhar",
    "id": 199
  },
  {
    "name": "Patiala",
    "id": 200
  },
  {
    "name": "Bathinda",
    "id": 201
  },
  {
    "name": "Phagwara",
    "id": 202
  },
  {
    "name": "Jaipur",
    "id": 203
  },
  {
    "name": "Jodhpur",
    "id": 204
  },
  {
    "name": "Kota",
    "id": 205
  },
  {
    "name": "Bikaner",
    "id": 206
  },
  {
    "name": "Ajmer",
    "id": 207
  },
  {
    "name": "Udaipur",
    "id": 208
  },
  {
    "name": "Bhilwara",
    "id": 209
  },
  {
    "name": "Alwar",
    "id": 210
  },
  {
    "name": "Bharatpur",
    "id": 211
  },
  {
    "name": "Sikar",
    "id": 212
  },
  {
    "name": "Pali",
    "id": 213
  },
  {
    "name": "Sri Ganganagar",
    "id": 214
  },
  {
    "name": "Gangtok",
    "id": 215
  },
  {
    "name": "Chennai",
    "id": 216
  },
  {
    "name": "Coimbatore",
    "id": 217
  },
  {
    "name": "Madurai",
    "id": 218
  },
  {
    "name": "Tiruchirappalli",
    "id": 219
  },
  {
    "name": "Tiruppur",
    "id": 220
  },
  {
    "name": "Salem",
    "id": 221
  },
  {
    "name": "Erode",
    "id": 222
  },
  {
    "name": "Ambattur",
    "id": 223
  },
  {
    "name": "Tirunelveli",
    "id": 224
  },
  {
    "name": "Avadi",
    "id": 225
  },
  {
    "name": "Tiruvottiyur",
    "id": 226
  },
  {
    "name": "Thoothukudi",
    "id": 227
  },
  {
    "name": "Nagercoil",
    "id": 228
  },
  {
    "name": "Thanjavur",
    "id": 229
  },
  {
    "name": "Pallavaram",
    "id": 230
  },
  {
    "name": "Dindigul",
    "id": 231
  },
  {
    "name": "Vellore",
    "id": 232
  },
  {
    "name": "Kumbakonam",
    "id": 233
  },
  {
    "name": "Karaikudi",
    "id": 234
  },
  {
    "name": "Warangal",
    "id": 235
  },
  {
    "name": "Nizamabad",
    "id": 236
  },
  {
    "name": "Khammam",
    "id": 237
  },
  {
    "name": "Karimnagar",
    "id": 238
  },
  {
    "name": "Ramagundam",
    "id": 239
  },
  {
    "name": "Secunderabad",
    "id": 240
  },
  {
    "name": "Secunderabad",
    "id": 241
  },
  {
    "name": "Mahaboobnagar",
    "id": 242
  },
  {
    "name": "Suryapet",
    "id": 243
  },
  {
    "name": "Miryalaguda",
    "id": 244
  },
  {
    "name": "Agartala",
    "id": 245
  },
  {
    "name": "Kanpur",
    "id": 246
  },
  {
    "name": "Lucknow",
    "id": 247
  },
  {
    "name": "Ghaziabad",
    "id": 248
  },
  {
    "name": "Agra",
    "id": 249
  },
  {
    "name": "Meerut",
    "id": 250
  },
  {
    "name": "Varanasi",
    "id": 251
  },
  {
    "name": "Allahabad / Prayagraj",
    "id": 252
  },
  {
    "name": "Bareilly",
    "id": 253
  },
  {
    "name": "Aligarh",
    "id": 254
  },
  {
    "name": "Aligarh",
    "id": 255
  },
  {
    "name": "Moradabad",
    "id": 256
  },
  {
    "name": "Saharanpur",
    "id": 257
  },
  {
    "name": "Gorakhpur",
    "id": 258
  },
  {
    "name": "Noida",
    "id": 259
  },
  {
    "name": "Firozabad",
    "id": 260
  },
  {
    "name": "Loni",
    "id": 261
  },
  {
    "name": "Jhansi",
    "id": 262
  },
  {
    "name": "Muzaffarnagar",
    "id": 263
  },
  {
    "name": "Mathura",
    "id": 264
  },
  {
    "name": "Shahjahanpur",
    "id": 265
  },
  {
    "name": "Rampur",
    "id": 266
  },
  {
    "name": "Mau",
    "id": 267
  },
  {
    "name": "Farrukhabad",
    "id": 268
  },
  {
    "name": "Hapur",
    "id": 269
  },
  {
    "name": "Etawah",
    "id": 270
  },
  {
    "name": "Mirzapur",
    "id": 271
  },
  {
    "name": "Bulandshahr",
    "id": 272
  },
  {
    "name": "Sambhal",
    "id": 273
  },
  {
    "name": "Amroha",
    "id": 274
  },
  {
    "name": "Fatehpur",
    "id": 275
  },
  {
    "name": "Raebareli",
    "id": 276
  },
  {
    "name": "Orai",
    "id": 277
  },
  {
    "name": "Bahraich",
    "id": 278
  },
  {
    "name": "Jaunpur",
    "id": 279
  },
  {
    "name": "Unnao",
    "id": 280
  },
  {
    "name": "Ballia",
    "id": 281
  },
  {
    "name": "Azamgarh",
    "id": 282
  },
  {
    "name": "Dehradun",
    "id": 283
  },
  {
    "name": "Haridwar",
    "id": 284
  },
  {
    "name": "Kolkata",
    "id": 285
  },
  {
    "name": "Howrah",
    "id": 286
  },
  {
    "name": "Durgapur",
    "id": 287
  },
  {
    "name": "Asansol",
    "id": 288
  },
  {
    "name": "Siliguri",
    "id": 289
  },
  {
    "name": "Maheshtala",
    "id": 290
  },
  {
    "name": "Rajpur Sonarpur",
    "id": 291
  },
  {
    "name": "South Dumdum",
    "id": 292
  },
  {
    "name": "Gopalpur",
    "id": 293
  },
  {
    "name": "Bhatpara",
    "id": 294
  },
  {
    "name": "Panihati",
    "id": 295
  },
  {
    "name": "Kamarhati",
    "id": 396
  },
  {
    "name": "Bardhaman",
    "id": 397
  },
  {
    "name": "Kulti",
    "id": 398
  },
  {
    "name": "Bally",
    "id": 399
  },
  {
    "name": "Barasat",
    "id": 400
  },
  {
    "name": "North Dumdum",
    "id": 401
  },
  {
    "name": "Baranagar",
    "id": 402
  },
  {
    "name": "Uluberia",
    "id": 403
  },
  {
    "name": "Naihati",
    "id": 404
  },
  {
    "name": "Bidhannagar",
    "id": 405
  },
  {
    "name": "Kharagpur",
    "id": 406
  },
  {
    "name": "Malda",
    "id": 407
  },
  {
    "name": "Haldia",
    "id": 408
  },
  {
    "name": "Madhyamgram",
    "id": 409
  },
  {
    "name": "Berhampore",
    "id": 410
  },
  {
    "name": "Raiganj",
    "id": 411
  },
  {
    "name": "Chinsurah",
    "id": 412
  },
  {
    "name": "Greater Noida",
    "id": 413
  },
  {
    "name": "Hariyana",
    "id": 414
  }
]



let city = 'Delhi'
sideBar(categories,city )
fillDropDown('cityid', cities, 'city of services', 0)


$('.city_change').change(function(){
 updatecity = $('.city_change').val()
 sideBar(categories,updatecity)
  })




function sideBar(data,city) {
    let table = ` 
    <div class="widget categories" style="margin-top:1px">
      <img src="/images/dial_delo_icon.png" style="width:40px">
     <span style="color:black;font-size:27px;margin-top:12px;font-family: 'Lato', sans-serif;position:relative;top:7px;font-weight:bold;color:#1f5ab0;">844</span> 
     <span style="color:black;font-size:27px;margin-top:12px;font-family: 'Lato', sans-serif;position:relative;top:7px;font-weight:bold"> - </span>
     <span style="color:black;font-size:27px;margin-top:12px;font-family: 'Lato', sans-serif;position:relative;top:7px;font-weight:bold;color:#1f5ab0;">  844 </span>
     <span style="color:black;font-size:27px;margin-top:12px;font-family: 'Lato', sans-serif;position:relative;top:7px;font-weight:bold">- </span>
     <span style="color:black;font-size:27px;margin-top:12px;font-family: 'Lato', sans-serif;position:relative;top:7px;font-weight:bold;color:#1f5ab0;"> 8638 </span>
     
   </h2>

     
     
     <ul class="categories-list ul" style="margin-top:2px;">`



    $.each(data, (i, item) => {
        if (i % 2 == 0) {
            table += `<li class="li" style="background-color:#E8F0FE">
<a href="/${city}-${item.seo_name}/dial-delo" style="font-size:13px; font-family: 'Lato', sans-serif;">
 <img src="/dial_icon/${item.logo}" style="width:30px;height:30px;">
 ${item.name}
</a>
</li>
`
        }
        else {
            table += `   <li class="li">
            <a href="/${city}-${item.seo_name}/dial-delo" style="font-size:13px; font-family: 'Lato', sans-serif;">
              <img src="/dial_icon/${item.logo}" style="width:30px;height:30px">
              ${item.name}
            </a>
          </li>`
        }
    })


    table += ` </div>`
    $('#dial_delo_category_list').html(table)
}




function fillDropDown(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    // $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
          if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.name).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.name).text(item.name))
        }
    })
}



function fillDropDown1(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.name))
        }
    })
}


})