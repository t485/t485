import * as React from "react";
import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import VotingGroup, { VotingGroupProps } from "./VotingGroup";
import "jest-chain";
import "jest-enzyme";

const defaultProps: Partial<VotingGroupProps> = {
	title: "Title",
	description: "A nice description can go here.",
};

describe("VotingGroup calls onSelectChanged with the proper argument", () => {
	test("with number values", () => {
		const onSelectChange = jest.fn();
		const props: VotingGroupProps = {
			...defaultProps,
			onSelectChange,
			options: [
				{
					label: "Option One",
					value: 1,
				},
				{
					label: "Option Two",
					value: 2,
				},
				{
					label: "Option Three",
					value: 3,
				},
			],
			value: [3],
		};

		// subject under test
		const sut = shallow(<VotingGroup {...props} />);
		// console.log(sut);
		sut.find("#check-0-number-1").simulate("change", {
			target: { value: "true" },
		});
		expect(onSelectChange).toHaveBeenNthCalledWith(1, 1, true);
		sut.find("#check-1-number-2").simulate("change", {
			target: { value: "true" },
		});
		expect(onSelectChange).toHaveBeenNthCalledWith(2, 2, true);
		sut.find("#check-2-number-3").simulate("change", {
			target: { value: "true" },
		});
		expect(onSelectChange).toHaveBeenNthCalledWith(3, 3, false);
	});
	test("with string values", () => {
		const onSelectChange = jest.fn();
		const props: VotingGroupProps = {
			...defaultProps,
			onSelectChange,
			options: [
				{
					label: "Option One",
					value: "1",
				},
				{
					label: "Option Two",
					value: "two",
				},
				{
					label: "Option Three",
					value: "thiisareallylongstringvalue",
				},
			],
			value: ["thiisareallylongstringvalue"],
		};

		const sut = shallow(<VotingGroup {...props} />);
		// console.log(sut);
		sut.find("#check-0-string-1").simulate("change", {
			target: { value: "true" },
		});
		expect(onSelectChange).toHaveBeenNthCalledWith(1, "1", true);
		sut.find("#check-1-string-two").simulate("change", {
			target: { value: "true" },
		});
		expect(onSelectChange).toHaveBeenNthCalledWith(2, "two", true);
		sut.find(
			"#check-2-string-thiisareallylongstringvalue"
		).simulate("change", { target: { value: "true" } });
		expect(onSelectChange).toHaveBeenNthCalledWith(
			3,
			"thiisareallylongstringvalue",
			false
		);
	});
});

describe("It renders maxVotes properly", () => {
	const props: VotingGroupProps = {
		...defaultProps,
		onSelectChange: () => {
			/* noop */
		},
		options: [
			{
				label: "Option One",
				value: 1,
			},
			{
				label: "Option Two",
				value: 2,
			},
			{
				label: "Option Three",
				value: 3,
			},
		],
		value: [1, 2],
	};

	const nonzeroSelectionSUT = mount(<VotingGroup {...props} maxVotes={2} />);
	test("It renders the correct validation state when there is a valid nonzero selection", () => {
		expect(
			nonzeroSelectionSUT.find(".votingGroupMaxVotes")
		).not.toHaveClassName("text-danger");
		expect(
			nonzeroSelectionSUT.find(".votingGroupMaxVotes")
		).toHaveClassName("text-muted");
		expect(nonzeroSelectionSUT.text()).toContain("2 of 2");
	});
	test("It matches the snapshot with a valid nonzero selection", () => {
		expect(toJson(nonzeroSelectionSUT)).toMatchSnapshot();
	});
	const invalidSelectionSUT = mount(<VotingGroup {...props} maxVotes={1} />);
	test("It renders the correct validation state when there is an invalid selection", () => {
		expect(
			invalidSelectionSUT.find(".votingGroupMaxVotes")
		).toHaveClassName("text-danger");
		expect(
			invalidSelectionSUT.find(".votingGroupMaxVotes")
		).not.toHaveClassName("text-muted");
		expect(invalidSelectionSUT.text()).toContain("2 of 1");
	});
	test("It matches the snapshot with an invalid selection", () => {
		expect(toJson(invalidSelectionSUT)).toMatchSnapshot();
	});
	const noSelectionProps: VotingGroupProps = {
		...props,
		value: undefined,
	};
	const noSelectionSUT = mount(
		<VotingGroup {...noSelectionProps} maxVotes={2} />
	);
	test("It renders the correct validation state when there is no selection", () => {
		expect(noSelectionSUT.find(".votingGroupMaxVotes")).not.toHaveClassName(
			"text-danger"
		);
		expect(noSelectionSUT.find(".votingGroupMaxVotes")).toHaveClassName(
			"text-muted"
		);

		expect(noSelectionSUT.text()).toContain("0 of 2");
	});
	test("It matches the snapshot with no selection", () => {
		expect(toJson(noSelectionSUT)).toMatchSnapshot();
	});
	const noMaxValueSUT = mount(<VotingGroup {...props} />);
	test("It doesn't render max votes text unless it is provided", () => {
		expect(noMaxValueSUT.find(".votingGroupMaxVotes")).not.toExist();
	});
});

describe("It matches the snapshot", () => {
	test("with title and description", () => {
		const props: VotingGroupProps = {
			...defaultProps,
			title: undefined,
			description: undefined,
			onSelectChange: () => {
				/* noop */
			},
			options: [
				{
					label: "Option One",
					value: "1",
				},
				{
					label: "Option Two",
					value: 2,
				},
				{
					label: "Option Three",
					value: "thiisareallylongstringvalue",
				},
			],
			value: ["1", 2],
		};

		const sut = mount(<VotingGroup {...props} />);
		expect(toJson(sut)).toMatchSnapshot();
		// expect(true).toBe(true);
		sut.unmount();
	});
	test("with no title or description", () => {
		const props: VotingGroupProps = {
			...defaultProps,
			title: undefined,
			description: undefined,
			onSelectChange: () => {
				/* noop */
			},
			options: [
				{
					label: "Option One",
					value: "1",
				},
				{
					label: "Option Two",
					value: 2,
				},
				{
					label: "Option Three",
					value: "thiisareallylongstringvalue",
				},
			],
			value: ["1", 2],
		};

		const sut = mount(<VotingGroup {...props} />);
		expect(toJson(sut)).toMatchSnapshot();
		// expect(true).toBe(true);
		sut.unmount();
	});
});
