import React from "react";
import { Table, Button } from "antd";
import { getTable, updateDatabase } from "./api/query";
import { CSVLink } from "react-csv";
import { ClimbingBoxLoader } from "react-spinners";

import "antd/dist/antd.css";
import "./App.css";

const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      extractedTable: null,
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault(); //onSubmit has its own internal state, and thus refreshing the page
    var { extractedTable } = await getTable(this.state.value);
    this.setState({
      extractedTable: extractedTable,
      loading: false
    });
  }

  async handleUpdate() {
    console.log("Updating databse");
    var res = await updateDatabase();
  }

  render() {
    const columns = [
      {
        title: "0",
        dataIndex: 0,
        key: "0"
      },
      {
        title: "1",
        dataIndex: 1,
        key: "1"
      },
      {
        title: "2",
        dataIndex: 2,
        key: "2"
      },
      {
        title: "3",
        dataIndex: 3,
        key: "3"
      },
      {
        title: "4",
        dataIndex: 4,
        key: "4"
      },
      {
        title: "5",
        dataIndex: 5,
        key: "5"
      },
      {
        title: "6",
        dataIndex: 6,
        key: "6"
      },
      {
        title: "7",
        dataIndex: 7,
        key: "7"
      },
      {
        title: "8",
        dataIndex: 8,
        key: "8"
      },
      {
        title: "10",
        dataIndex: 10,
        key: "10"
      },
      {
        title: "11",
        dataIndex: 11,
        key: "11"
      }
    ];

    const data2 = [
      [
        "0101",
        "0",
        "Live horses, asses, mules and hinnies:",
        "",
        "",
        "",
        "",
        "",
        "",
        [
          [
            "0101",
            "1",
            "Horses:",
            "",
            "",
            "",
            "",
            "",
            "",
            [
              [
                "0101.21.00",
                "2",
                "Purebred breeding animals",
                "",
                "Free",
                "",
                "Free",
                "",
                "",
                [
                  [
                    "0101.21.00.10",
                    "3",
                    "Males",
                    '["No."]',
                    "",
                    "",
                    "",
                    "",
                    "",
                    [],
                    "",
                    ["male", "maless", "males"]
                  ],
                  [
                    "0101.21.00.20",
                    "3",
                    "Females",
                    '["No."]',
                    "",
                    "",
                    "",
                    "",
                    "",
                    [],
                    "",
                    ["femaless", "females", "female"]
                  ]
                ],
                "",
                [
                  "animal",
                  "purebreds",
                  "breeding",
                  "animalss",
                  "animals",
                  "purebred",
                  "breedings",
                  "breed"
                ]
              ],
              [
                "0101.29.00",
                "2",
                "Other",
                "",
                "Free",
                "",
                "20%",
                "",
                "",
                [
                  [
                    "0101.29.00.10",
                    "3",
                    "Imported for immediate slaughter",
                    '["No."]',
                    "",
                    "",
                    "",
                    "",
                    "",
                    [],
                    "",
                    [
                      "immediate",
                      "immediates",
                      "imported",
                      "import",
                      "slaughter",
                      "importeds",
                      "slaughters"
                    ]
                  ],
                  [
                    "0101.29.00.90",
                    "3",
                    "Other",
                    '["No."]',
                    "",
                    "",
                    "",
                    "",
                    "",
                    [],
                    "",
                    ["others", "other"]
                  ]
                ],
                "",
                ["others", "other"]
              ]
            ],
            "",
            ["horsess", "horse", "horses"]
          ],
          [
            "0101.30.00.00",
            "1",
            "Asses",
            '["No."]',
            "6.8%",
            "Free (A+,AU,BH,CA,CL,CO,D,E,IL,JO,KR,MA,MX,OM,P,PA,PE,SG)",
            "15%",
            "",
            "",
            [],
            "",
            ["ass", "assess", "asses"]
          ],
          [
            "0101.90",
            "1",
            "Other:",
            "",
            "",
            "",
            "",
            "",
            "",
            [
              [
                "0101.90.30.00",
                "2",
                "Imported for immediate slaughter",
                '["No."]',
                "Free",
                "",
                "Free",
                "",
                "",
                [],
                "",
                [
                  "immediate",
                  "immediates",
                  "imported",
                  "import",
                  "slaughter",
                  "importeds",
                  "slaughters"
                ]
              ],
              [
                "0101.90.40.00",
                "2",
                "Other",
                '["No"]',
                "4.5%",
                "Free (A+,AU,BH, CA,CL,CO,D,E, IL,JO,KR,MA, MX,OM,P,PA,PE, SG)",
                "20%",
                "",
                "",
                [],
                "",
                ["others", "other"]
              ]
            ],
            "",
            ["others", "other"]
          ]
        ],
        "",
        [
          "mule",
          "hinny",
          "hinnies",
          "horse",
          "horses",
          "assess",
          "mules",
          "asses",
          "muless",
          "ass",
          "horsess",
          "lives",
          "hinniess",
          "live"
        ]
      ],
      [
        "0101",
        "1",
        "Horses:",
        "",
        "",
        "",
        "",
        "",
        "",
        [
          [
            "0101.21.00",
            "2",
            "Purebred breeding animals",
            "",
            "Free",
            "",
            "Free",
            "",
            "",
            [
              [
                "0101.21.00.10",
                "3",
                "Males",
                '["No."]',
                "",
                "",
                "",
                "",
                "",
                [],
                "",
                ["male", "maless", "males"]
              ],
              [
                "0101.21.00.20",
                "3",
                "Females",
                '["No."]',
                "",
                "",
                "",
                "",
                "",
                [],
                "",
                ["femaless", "females", "female"]
              ]
            ],
            "",
            [
              "animal",
              "purebreds",
              "breeding",
              "animalss",
              "animals",
              "purebred",
              "breedings",
              "breed"
            ]
          ],
          [
            "0101.29.00",
            "2",
            "Other",
            "",
            "Free",
            "",
            "20%",
            "",
            "",
            [
              [
                "0101.29.00.10",
                "3",
                "Imported for immediate slaughter",
                '["No."]',
                "",
                "",
                "",
                "",
                "",
                [],
                "",
                [
                  "immediate",
                  "immediates",
                  "imported",
                  "import",
                  "slaughter",
                  "importeds",
                  "slaughters"
                ]
              ],
              [
                "0101.29.00.90",
                "3",
                "Other",
                '["No."]',
                "",
                "",
                "",
                "",
                "",
                [],
                "",
                ["others", "other"]
              ]
            ],
            "",
            ["others", "other"]
          ]
        ],
        "",
        ["horsess", "horse", "horses"]
      ],
      [
        "0101.21.00",
        "2",
        "Purebred breeding animals",
        "",
        "Free",
        "",
        "Free",
        "",
        "",
        [
          [
            "0101.21.00.10",
            "3",
            "Males",
            '["No."]',
            "",
            "",
            "",
            "",
            "",
            [],
            "",
            ["male", "maless", "males"]
          ],
          [
            "0101.21.00.20",
            "3",
            "Females",
            '["No."]',
            "",
            "",
            "",
            "",
            "",
            [],
            "",
            ["femaless", "females", "female"]
          ]
        ],
        "",
        [
          "animal",
          "purebreds",
          "breeding",
          "animalss",
          "animals",
          "purebred",
          "breedings",
          "breed"
        ]
      ],
      [
        "0101.21.00.10",
        "3",
        "Males",
        '["No."]',
        "",
        "",
        "",
        "",
        "",
        [],
        "",
        ["male", "maless", "males"]
      ]
    ];
    const data = [
      // Object.assign({}, ["0101", "1", Object.assign({}, ["horse", "horses"])])
      Object.assign({}, [
        "John Brown sr.",
        60,
        [
          ["Jane Cow", 42],
          ["Jane Meh", 52]
        ]
      ])
    ];

    const data3 = [
      {
        name: "John Brown sr.",
        age: 60,
        address: "New York No. 1 Lake Park",
        flag: true,
        children: [
          {
            name: "John Brown",
            age: 42,
            address: "New York No. 2 Lake Park"
          },
          {
            name: "John Brown jr.",
            age: 30,
            address: "New York No. 3 Lake Park",
            children: [
              {
                name: "Jimmy Brown",
                age: 16,
                address: "New York No. 3 Lake Park"
              }
            ]
          },
          {
            name: "Jim Green sr.",
            age: 72,
            address: "London No. 1 Lake Park",
            children: [
              {
                name: "Jim Green",
                age: 42,
                address: "London No. 2 Lake Park",
                children: [
                  {
                    name: "Jim Green jr.",
                    age: 25,
                    address: "London No. 3 Lake Park"
                  },
                  {
                    name: "Jimmy Green sr.",
                    age: 18,
                    address: "London No. 4 Lake Park"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
      }
    ];

    const columns2 = [
      {
        title: "Name",
        dataIndex: "name"
      },
      {
        title: "Age",
        dataIndex: "age",
        width: "12%"
      },
      {
        title: "Address",
        dataIndex: "address",
        width: "30%"
      }
    ];
    return (
      <div className="wrapper">
        {console.log(data)}
        <div className="main">
          <div className="title">Harmonized Tariff Schedule Code</div>
          <div className="header">
            <div className="header__searchBox">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Query:
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </label>
                <input
                  style={{ margin: "10px" }}
                  type="submit"
                  value="Submit"
                />
              </form>
            </div>
            <div>
              <Button
                type="primary"
                icon="api"
                size={"large"}
                onClick={this.handleUpdate}
              >
                Update Database
              </Button>
            </div>
            {this.state.extractedCSV != null && this.state.flag === 0 && (
              <CSVLink data={this.state.extractedCSV}>
                <Button type="primary" icon="download" size={"large"}>
                  Download
                </Button>
              </CSVLink>
            )}
          </div>

          <Table
            dataSource={data2}
            columns={columns}
            childrenColumnName={"9"}
            rowClassName={record => (record.flag ? "test" : "test1")}
          />
        </div>
        <div
          style={{ display: this.state.loading ? "flex" : "none" }}
          className="wrapper__overlay"
        >
          <div className="spinner">
            <ClimbingBoxLoader
              css={override}
              size={20}
              color={"#36ffcd"}
              loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
