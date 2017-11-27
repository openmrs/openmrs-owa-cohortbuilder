import {
  formatDate,
  queryDescriptionBuilder
} from "../../app/js/helpers/helpers";
import { expect } from "chai";

const mockConceptName = "Weight (Kg)";

const mockState = {
  timeModifier: "ANY",
  question: "7fae062d-a5a4-4d02-885c-ddd60adde01f",
  operator1: "LESS_THAN",
  modifier: "",
  onOrBefore: "",
  onOrAfter: "",
  formToRender: ""
};

const mockStateWithMoreData = {
  timeModifier: "ANY",
  question: "7fae062d-a5a4-4d02-885c-ddd60adde01f",
  operator1: "LESS_THAN",
  modifier: "20",
  onOrBefore: "2017-11-01T11:00:00.000Z",
  onOrAfter: "2016-12-01T11:00:00.000Z",
  formToRender: ""
};

describe("formatDate function", () => {
  it("should format date in the dd/mm/yy format", () => {
    expect(formatDate("2017-01-01T11:00:00.000Z")).to.equal("1/1/2017");
    expect(formatDate("2017-11-01T11:00:00.000Z")).to.equal("1/11/2017");
  });
  it("should return the correct formatted date", () => {
    expect(formatDate("2017-01-01T11:00:00.000Z")).to.not.equal("1/1/2020");
  });
});

describe("queryDescriptionBuilder function", () => {
  before(() => {
    // Create a mock Select element with options before running the tests
    const mockSelectElement = document.createElement("select");
    mockSelectElement.id = "operator1";
    const mockSelectOption = document.createElement("option");
    mockSelectOption.value = "LESS_THAN";
    mockSelectOption.text = "<";
    mockSelectElement.selectedIndex = 0;
    mockSelectElement.appendChild(mockSelectOption);
    document.body.appendChild(mockSelectElement);
  });

  it("should return only timeModifier and concept name if modifier is not provided", () => {
    expect(queryDescriptionBuilder(mockState, mockConceptName)).to.equal(
      "Patients with ANY Weight (Kg)"
    );
  });
  it("should return a properly formatted message when all data is provided", () => {
    expect(
      queryDescriptionBuilder(mockStateWithMoreData, mockConceptName)
    ).to.equal(
      "Patients with ANY Weight (Kg) < 20 since 1/12/2016 until 1/11/2017"
    );
  });
});
