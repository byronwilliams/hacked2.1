package main

import (
    // "log"
    "fmt"
    "net/http"
    "gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "encoding/json"
    // "time"
)


type Transaction struct {
    Id    bson.ObjectId `bson:"_id"`
    TransactionNumber string `bson:"TransactionNumber"`
    ServiceAreaCategorisation string `bson:"ServiceAreaCategorisation"`
    Amount float32 `bson:"Amount"`
    ExpensesType string `bson:"ExpensesType"`
    ServiceCode string `bson:"ServiceCode"`
    AccountCodeDescription  string `bson:"AccountCodeDescription"`
    Date string `bson:"Date"`
    SupplierName string `bson:"SupplierName"`
    BodyName string `bson:"BodyName"`
    Year string `bson:"Year"`
    Month string `bson:"Month"`
    Votes float32 `bson:"Votes"`
}


func CompaniesHandler(w http.ResponseWriter, r *http.Request) {
    session, err := mgo.Dial("localhost")
    if err != nil {
            panic(err)
    }
    defer session.Close()

    session.SetMode(mgo.Monotonic, true)

    c := session.DB("hacked").C("transactions")

    r.ParseForm()

    var result = []Transaction{}
    var q = bson.M{}

    if len(r.Form.Get("SupplierName")) > 0 {
        q["SupplierName"] = r.Form.Get("SupplierName")
    }

    if len(r.Form.Get("Year")) > 0 {
        q["Year"] = r.Form.Get("Year")
    }

    if len(r.Form.Get("Month")) > 0 {
        q["Month"] = r.Form.Get("Month")
    }

    if len(r.Form.Get("SupplierName")) > 0 {
        c.Find(q).All(&result)
    } else {
        c.Find(q).Limit(100).All(&result)
    }

    var indented, _ = json.MarshalIndent(result, "", "  ")
    fmt.Fprintf(w, "%s\n", indented)
}

func LtdCompaniesHandler(w http.ResponseWriter, r *http.Request) {
    session, err := mgo.Dial("localhost")
    if err != nil {
            panic(err)
    }
    defer session.Close()

    session.SetMode(mgo.Monotonic, true)

    c := session.DB("hacked").C("transactions")

    var result []string

    var err2 = c.Find(nil).Distinct("SupplierName", &result)
    fmt.Println(len(result))
    if err2 != nil {
        fmt.Println(err2)
    }

    var indented, _ = json.MarshalIndent(result, "", "  ")
    fmt.Fprintf(w, "%s\n", indented)
}


func UpdateHandler(w http.ResponseWriter, r *http.Request) {
    session, err := mgo.Dial("localhost")
    if err != nil {
            panic(err)
    }
    defer session.Close()
    session.SetMode(mgo.Monotonic, true)

    c := session.DB("hacked").C("transactions")

    var t Transaction
    var decoder = json.NewDecoder(r.Body)
    decoder.Decode(&t)

    c.Update(bson.M{"_id": t.Id}, t)
}

func serveSingle(pattern string, filename string) {
    http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, filename)
    })
}

func main() {
    http.Handle("/", http.FileServer(http.Dir("./app/")))
    http.Handle("/bower_components/", http.FileServer(http.Dir(".")))
    http.HandleFunc("/api/companies/", CompaniesHandler)
    http.HandleFunc("/api/update/", UpdateHandler)
    http.HandleFunc("/api/ltdcompanies/", LtdCompaniesHandler)

    http.ListenAndServe(":8080", nil)
}
