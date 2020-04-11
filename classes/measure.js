class Measure
{
    static length = {
        Mr: 1737,
        Er: 6371,
        Sr: 696340,
        AU: 149597870,
        LS: 299792,
        LY: 9460730472580,
        PC: 30856775814913,

        units: {
            M: {
                value: 0.001,
                name: "Meters",
                uname: "Meter",
                symbol: "m"
            },
            KM: {
                value: 1,
                name: "Kilometers",
                uname: "Kilometer",
                symbol: "km"
            },
            SR: {
                value: 696340,
                name: "Solar radiuses",
                uname: "Solar radius",
                symbol: "R☉"
            },
            LS: {
                value: 299792,
                name: "Light-Seconds",
                uname: "Light-Second",
                symbol: "ls"
            },
            AU: {
                value: 149597870,
                name: "Astronomical Units",
                uname: "Astronomical Unit",
                symbol: "A.U."
            },
            LY: {
                value: 9460730472580,
                name: "Light-Years",
                uname: "Light-Year",
                symbol: "ly"
            },
            PC: {
                value: 30856775814913,
                name: "Parsecs",
                uname: "Parsec",
                symbol: "pc"
            },
        }
    }
    static mass = {
        Mm: 7.34767309e22,
        Em: 5.9722e24,
        Sm: 1.98847e30,

        units: {
            G: {
                value: 0.001,
                name: "Grams",
                uname: "Gram",
                symbol: "g"
            },
            KG: {
                value: 1,
                name: "Kilograms",
                uname: "Kilogram",
                symbol: "kg"
            },
            T: {
                value: 1000,
                name: "Tonnes",
                uname: "Tonne",
                symbol: "t"
            },
            SM: {
                value: 1.98847e30,
                name: "Solar masses",
                uname: "Solar mass",
                symbol: "M☉"
            },
        }
    }
    static temperature = {
        St: 5778,

        units: {
            K: {
                value: 1,
                name: "Kelvins",
                uname: "Kelvin",
                symbol: "K"
            }
        }
    }
    static luminosity = {
        units: {
            W: {
                value: 2.613e-27,
                name: "Watts",
                uname: "Watt",
                symbol: "W"
            },
            SL: {
                value: 1,
                name: "Solar luminosities",
                uname: "Solar luminosity",
                symbol: "L☉"
            }
        }
    }

}
