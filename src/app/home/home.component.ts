import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import data from '../../assets/data.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  id: any;                /* variable to carry all ids */
  month: any;             /* variable to carry all months */
  camp: any;              /* variable to carry all camps */
  country: any;           /* variable to carry all countries */
  school: any;            /* variable to carry all schools */
  lessons: any;           /* variable to carry all lessons */
  allCountries: any;      /* variable to carry all unique countries */
  allCamps: any;          /* variable to carry all unique camps */
  allSchools: any;        /* variable to carry all unique schools */
  currCamp: any;          /* variable to carry current camp */
  currCountry: any;       /* variable to carry current country */
  currSchool: any;        /* variable to carry current school */
  allLessons: any;        /* variable to carry sum of lessons for specific camp */
  currDataArr: any;       /* variable to carry data for camp */
  finalData: any;         /* variable to carry final data for camp */

  constructor() { }

  ngOnInit(): void {

    let currSchoolsForCamp = [];    /* carry unique schools for specific camp and country */
    let currDataForSchoolCamp = []; /* carry data for school in specific camp */

    this.currCamp = 'Omaka';        /* current camp */
    this.currCountry = 'Egypt';     /* current country */
    this.currSchool = 'all';        /* current school */

    /**
     * map data from data.json and assign it to the above values
     */
    this.id = data.map((id: any) => id.id);
    this.month = data.map((month: any) => month.month);
    this.camp = data.map((camp: any) => camp.camp);
    this.country = data.map((country: any) => country.country);
    this.school = data.map((school: any) => school.school);
    this.lessons = data.map((lessons: any) => lessons.lessons);

    /**
     * get unique values and assign it to the above arrays
     */
    this.allCountries = [...new Set(this.country)];
    this.allCamps = [...new Set(this.camp)];
    this.allSchools = [...new Set(this.school)];

    /**
     * get data for schols for specific country and camp
     * check if current school is equal to all, get data for all schools
     * else if current school is equal to specific value, get data for this school
     */
    for (let i = 0; i < data.length; i++) {
      if (this.currCountry == data[i].country) {
        if (this.currCamp == data[i].camp) {
          if (this.currSchool == 'all') {
            if (this.currCamp == data[i].camp && this.currCountry == data[i].country) {
              currSchoolsForCamp.push(data[i].school);
              currDataForSchoolCamp.push({'school': data[i].school, 'lessons': data[i].lessons});
            }
          }
        }
      }
    }

    /* get number of lessons for every school and put them in an array */
    function groupBy(arr:any, property:any) {
      return arr.reduce((acc:any, cur:any) => {
        acc[cur[property]] = [...acc[cur[property]] || [], cur];
        return acc;
      }, {});
    }

    // console.log(groupBy(currDataForSchoolCamp, 'school'));
    /**
     * calculate the sum of all lessons for specific camp
     */
    this.allLessons = 0;
    for (let i = 0; i < currDataForSchoolCamp.length; i++) {
      this.allLessons += currDataForSchoolCamp[i].lessons;
    }

    let currData = groupBy(currDataForSchoolCamp, 'school');
    let currDataArr = [];
    for (let i in currData) {
      currDataArr.push(currData[i]);
    }
    this.currDataArr = currDataArr;

    let finalData = [];
    for (let i = 0; i < currDataArr.length; i++) {
      const res = Array.from(currDataArr[i].reduce(
        (m: any, {school, lessons}: any) => m.set(school, (m.get(school) || 0) + lessons), new Map
      ), ([school, lessons]) => ({school, lessons}));
      finalData.push(res);
    }
    this.finalData = finalData;
    console.log(this.finalData);

    Chart.register(...registerables);
    const myChart = new Chart("myChart", {
      type: 'line',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Omaka',
              data: [9,7,15,11,26,23,17,39,29,33,9, 19],
              fill: false,
              borderColor: '#eebbba',
              borderWidth: 4,
              backgroundColor: '#fcfefb',
            },
          ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true
            },
          }
        }
      }
    });
  }

}
