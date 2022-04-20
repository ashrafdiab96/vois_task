import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import data from '../../assets/data.json';

/**
 * array of colors
 */
const colors = ['#eebbba', '#ceb4e2', '#4eb1a7', '#ebdf76', '#9fd95c'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  id: any; /* variable to carry all ids */
  month: any; /* variable to carry all months */
  camp: any; /* variable to carry all camps */
  country: any; /* variable to carry all countries */
  school: any; /* variable to carry all schools */
  lessons: any; /* variable to carry all lessons */
  allCountries: any; /* variable to carry all unique countries */
  allCamps: any; /* variable to carry all unique camps */
  allSchools: any; /* variable to carry all unique schools */
  currCamp: any; /* variable to carry current camp */
  currCountry: any; /* variable to carry current country */
  currSchool: any; /* variable to carry current school */
  allLessons: any; /* variable to carry sum of lessons for specific camp */
  currDataArr: any; /* variable to carry data for camp */
  finalData: any; /* variable to carry final data for camp */
  myChart: any; /* variable to carry the chart */

  constructor() { }

  /**
   * function to get selected country
   * @param countryVal
   */
  selectedCountry(countryVal: any): void {
    this.myChart.destroy();
    this.currCountry = countryVal.value;
    localStorage.setItem('current_country', countryVal.value);
    this.drawChart();
  }

  /**
   * function to get selected camp
   * @param campVal
   */
  selectedCamp(campVal: any): void {
    this.myChart.destroy();
    this.currCountry = campVal.value;
    localStorage.setItem('current_camp', campVal.value);
    this.drawChart();
  }

  /**
   * function to get selected camp
   * @param schoolVal
   */
  selectedSchool(schoolVal: any): void {
    this.myChart.destroy();
    this.currCountry = schoolVal.value;
    localStorage.setItem('current_school', schoolVal.value);
    this.drawChart();
  }

  /**
   * function to draw the chart
   */
  drawChart(): void {
    /**
     * variables declaration
     */
    let currSchoolsForCamp =
      []; /* carry schools for specific camp and country */
    let currDataForSchoolCamp = []; /* carry data for school in specific camp */
    let currUniqueSchools =
      []; /* carry unique schools for specific camp and country */
    let schoolsData: any; /* carry camp schools data in an object */
    let allSchoolsLessonsArr: any = []; /* carry all schools data in an array */
    let currDataArr = []; /* carry the sata for every school */
    let finalData = []; /* carry final camp data */

    /**
     * set default value to camp, country, and schol
     */
    /* current camp */
    this.currCamp = localStorage.getItem('current_camp') || 'Omaka';
    /* current country */
    this.currCountry = localStorage.getItem('current_country') || 'Egypt';
    /* current school */
    this.currSchool = localStorage.getItem('current_school') || 'all';

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
            if (
              this.currCamp == data[i].camp &&
              this.currCountry == data[i].country
            ) {
              currSchoolsForCamp.push(data[i].school);
              currDataForSchoolCamp.push({
                school: data[i].school,
                lessons: data[i].lessons,
              });
            }
          } else {
            if (
              this.currCamp == data[i].camp &&
              this.currCountry == data[i].country &&
              this.currSchool == data[i].school
            ) {
              currSchoolsForCamp.push(data[i].school);
              currDataForSchoolCamp.push({
                school: data[i].school,
                lessons: data[i].lessons,
              });
            }
          }
        }
      }
    }
    currUniqueSchools = [...new Set(currSchoolsForCamp)];

    /**
     * function to group some data
     */
    function groupBy(arr: any, property: any) {
      return arr.reduce((acc: any, cur: any) => {
        acc[cur[property]] = [...(acc[cur[property]] || []), cur];
        return acc;
      }, {});
    }

    /**
     * calculate the sum of all lessons for specific camp
     */
    this.allLessons = 0;
    for (let i = 0; i < currDataForSchoolCamp.length; i++) {
      this.allLessons += currDataForSchoolCamp[i].lessons;
    }

    /**
     * group the data for every school
     */
    let currData = groupBy(currDataForSchoolCamp, 'school');

    /**
     * put every school data in an array
     */
    for (let i in currData) {
      currDataArr.push(currData[i]);
    }
    this.currDataArr = currDataArr;

    /**
     * put camp data in an array to show them in the page
     */
    for (let i = 0; i < currDataArr.length; i++) {
      const res = Array.from(
        currDataArr[i].reduce(
          (m: any, { school, lessons }: any) =>
            m.set(school, (m.get(school) || 0) + lessons),
          new Map()
        ),
        ([school, lessons]) => ({ school, lessons })
      );
      finalData.push(res);
    }
    this.finalData = finalData;

    /**
     * group camp data in an object
     */
    schoolsData = groupBy(currDataForSchoolCamp, 'school');

    for (let property in schoolsData) {
      let schoolsLessonsArr: any = [];
      for (let i = 0; i < schoolsData[property].length; i++) {
        schoolsLessonsArr.push(schoolsData[property][i]);
      }
      allSchoolsLessonsArr.push(schoolsLessonsArr);
    }

    let campItems: any = [];
    allSchoolsLessonsArr.forEach(function (childArray: any) {
      childArray.forEach(function (item: any) {
        campItems.push(item);
      });
    });

    /**
     * register all types of charts
     */
    Chart.register(...registerables);

    /**
     * create new chart
     */
    this.myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
            },
          },
        },
      },
    });

    /**
     * get every school lessons in an array
     */
    let allLessons = [];
    for (let i = 0; i < currUniqueSchools.length; i++) {
      let schoolLessons = [];
      for (let j = 0; j < campItems.length; j++) {
        if (currUniqueSchools[i] == campItems[j].school) {
          schoolLessons.push(campItems[j]['lessons']);
        }
      }
      allLessons.push(schoolLessons);
    }

    /**
     * add datasets dynamically and update the chart
     */
    for (let i = 0; i < currUniqueSchools.length; i++) {
      this.myChart.data.datasets.push({
        label: currUniqueSchools[i],
        data: allLessons[i],
        fill: false,
        borderColor: colors[i],
        borderWidth: 4,
        backgroundColor: '#fcfefb',
      });
      this.myChart.update();
    }
  }

  ngOnInit(): void {
    this.drawChart();
  }
}
