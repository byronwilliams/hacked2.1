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

    if len(r.Form.Get("supplierName")) > 0 {
        var q = c.Find(bson.M{"SupplierName": r.Form.Get("supplierName")})

        if(len(r.Form.Get("year")) > 0) {
            fmt.Println(r.Form.Get("year"))
            q = c.Find(bson.M{"Year": r.Form.Get("year")})
        }

        if(len(r.Form.Get("month")) > 0) {
            fmt.Println(r.Form.Get("month"))
            q = c.Find(bson.M{"Month": r.Form.Get("month")})
        }


        var err2 = q.All(&result)
        fmt.Println(result)

        if err2 != nil {
            fmt.Println(err2)
        }

        var indented, _ = json.MarshalIndent(result, "", "  ")
        fmt.Fprintf(w, "%s\n", indented)
    }
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

    // http.HandleFunc("/", HomeHandler) // homepage

    http.ListenAndServe(":8080", nil)
}
