import { FC, useEffect, useRef, useState } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { countryData } from "../../utils/countryData";
import { Country, PhoneExtensionPickerProps } from "../../types";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { StyledInputV2 } from "../design/StyledInputV2";

export const PhoneExtensionPicker: FC<PhoneExtensionPickerProps> = ({
  defaultPhoneExtension,
  // selectedPhoneExtension,
  // setSelectedPhoneExtension,
  z,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isPhoneExtensionPickerVisible, setIsPhoneExtensionPickerVisible] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPhoneExtension, setSelectedPhoneExtension] =
    useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const phoneExtensionPickerRef = useRef<HTMLDivElement | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  useEffect(() => {
    setCountries(countryData);
  }, []);

  useEffect(() => {
    console.log("countries", countries);
  }, [countries]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        phoneExtensionPickerRef.current &&
        !phoneExtensionPickerRef.current.contains(event.target as Node)
      ) {
        setIsPhoneExtensionPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPhoneExtensionPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPhoneExtensionPickerVisible]);

  function handleCountryClick(country: Country) {
    // setSearchTerm(`${country.countryName} (${country.phoneExtension})`);
    // setSelectedPhoneExtension(country.phoneExtension);
    // setSelectedCountryCode(country.countryCode);
    // setSelectedCountryCode(country.countryCode);
    // setSelectedPhoneExtension(country.phoneExtension);
    setSearchTerm(`${country.countryName} (${country.phoneExtension})`);
    setIsPhoneExtensionPickerVisible(false);
  }

  function filterCountries() {
    const filteredCountries = countries.filter((filteredCountry: Country) => {
      const countryNameMatch = filteredCountry.countryName
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
      const countryCodeMatch = filteredCountry.countryCode
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
      const countryPhoneExtension = filteredCountry.phoneExtension
        .toLowerCase()
        .substring(1)
        .startsWith(searchTerm.toLowerCase());
      const countryNameAndPhoneExtensionMatch =
        `${filteredCountry.countryName.toLowerCase()} (${filteredCountry.phoneExtension.toLowerCase()})`.startsWith(
          searchTerm.toLowerCase()
        );

      return (
        countryNameMatch ||
        countryCodeMatch ||
        countryPhoneExtension ||
        countryNameAndPhoneExtensionMatch
      );
    });

    return filteredCountries;
  }

  useEffect(() => {
    setFilteredCountries(filterCountries());
  }, [searchTerm]);

  useEffect(() => {
    for (let i = 0; i < filteredCountries.length; i++) {
      if (
        searchTerm.toLowerCase() !==
          filteredCountries[i].countryName.toLowerCase() &&
        searchTerm.toLowerCase() !==
          filteredCountries[i].phoneExtension.toLowerCase().substring(1) &&
        // searchTerm.toLowerCase() !==
        //     filteredCountries[i].countryCode.toLowerCase() &&
        searchTerm.toLowerCase() !==
          `${filteredCountries[i].countryName.toLowerCase()} (${
            filteredCountries[i].phoneExtension
          })`
      ) {
        setSelectedCountryCode("");
        setSelectedPhoneExtension("");
        break;
      } else if (
        searchTerm.toLowerCase() ===
          filteredCountries[i].countryName.toLowerCase() ||
        searchTerm.toLowerCase() ===
          filteredCountries[i].phoneExtension.toLowerCase().substring(1) ||
        // searchTerm.toLowerCase() ===
        //     filteredCountries[i].countryCode.toLowerCase() ||
        searchTerm.toLowerCase() ===
          `${filteredCountries[i].countryName.toLowerCase()} (${
            filteredCountries[i].phoneExtension
          })`
      ) {
        setSelectedCountryCode(filteredCountries[i].countryCode);
        setSelectedPhoneExtension(filteredCountries[i].phoneExtension);
        setSearchTerm(
          `${filteredCountries[i].countryName} (${filteredCountries[i].phoneExtension})`
        );
        break;
        // setSearchTerm(
        //   `${filteredCountries[i].countryName} ${filteredCountries[i].phoneExtension}`
        // );
      }
    }

    // if (
    //   filteredCountries.length === 1 &&
    //   !searchTerm.split(" ").includes(filteredCountries[0].countryName)
    // ) {
    //   console.log(
    //     "logged",
    //     filteredCountries[0].countryName,
    //     searchTerm,
    //     !searchTerm.split(" ").includes(filteredCountries[0].countryName),
    //     searchTerm.split(" ")
    //   );

    //   setSelectedCountryCode(filteredCountries[0].countryCode);
    //   setSelectedPhoneExtension(filteredCountries[0].phoneExtension);
    // }

    console.log(filteredCountries);
  }, [filteredCountries, searchTerm, selectedCountryCode]);

  useEffect(() => {
    const foundCountry = countries.find(
      (country: Country) => country.phoneExtension === defaultPhoneExtension
    );
    if (foundCountry) {
      setSelectedPhoneExtension(foundCountry.phoneExtension);
      setSelectedCountryCode(foundCountry.phoneExtension);
      setSearchTerm(
        `${foundCountry.countryName} (${foundCountry.phoneExtension})`
      );
    }
  }, [countries, defaultPhoneExtension]);

  // useEffect(() => {
  //   const foundCountry = countries.find(
  //     (country: Country) => country.countryCode === selectedCountryCode
  //   );
  //   if (foundCountry && filteredCountries.length === 1) {
  //     setSearchTerm(
  //       `${foundCountry.countryName} (${foundCountry.phoneExtension})`
  //     );
  //   }
  // }, [selectedCountryCode, filteredCountries, countries]);

  useEffect(() => {
    console.log(
      "searchTerm",
      searchTerm,
      "selected country",
      selectedCountryCode,
      selectedPhoneExtension
    );
  }, [searchTerm, selectedCountryCode, selectedPhoneExtension]);

  useEffect(() => {
    if (selectedCountryCode === "" && selectedPhoneExtension === "") {
      setSelectedCountryCode("");
      setSelectedPhoneExtension("");
      setSearchTerm("");
    }
  }, [selectedCountryCode, selectedPhoneExtension]);

  return (
    <div className="w-full flex">
      <div className={`w-full relative ${z}`} ref={phoneExtensionPickerRef}>
        {/* <StyledInput
          styledInputWidth="w-42"
          label={"Phone Extension Picker"}
          inputValue={searchTerm}
          name="phoneExtensionPicker"
          onChangeStyledInput={(event) => {
            setSearchTerm(event.target.value);
            setIsPhoneExtensionPickerVisible(true);
          }}
          onClickInput={() => {
            setIsPhoneExtensionPickerVisible(!isPhoneExtensionPickerVisible);
          }}
          icon={
            <div
              className={`transition-transform transform ${
                !isPhoneExtensionPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  // setIsUserPickerVisible(!isUserPickerVisible);
                }}
              />
            </div>
          }
          isPicker={true}
          isPickerVisible={isPhoneExtensionPickerVisible}
        /> */}
        <StyledInputV2
          unfocusedTextColor={
            searchTerm.length === 0
              ? "text-black"
              : selectedPhoneExtension.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedBorderColor={
            searchTerm.length === 0
              ? "border-black"
              : selectedPhoneExtension.length > 0
              ? "border-green-700"
              : "border-red-700"
          }
          focusedTextColor={
            searchTerm.length === 0
              ? "focus:text-pink-500"
              : selectedPhoneExtension.length > 0
              ? "focus:text-green-500"
              : "focus:text-red-500"
          }
          focusedBorderColor={
            searchTerm.length === 0
              ? "focus:border-pink-500"
              : selectedPhoneExtension.length > 0
              ? "focus:border-green-500"
              : "focus:border-red-500"
          }
          focusedBorderColorIconArea={
            searchTerm.length === 0
              ? "border-pink-500"
              : selectedPhoneExtension.length > 0
              ? "border-green-500"
              : "border-red-500"
          }
          unfocusedLabelColor={
            searchTerm.length === 0
              ? "text-black"
              : selectedPhoneExtension.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor={
            searchTerm.length === 0
              ? "text-pink-500"
              : selectedPhoneExtension.length > 0
              ? "text-green-500"
              : "text-red-500"
          }
          focusedLabelBackgroundColor="bg-white"
          icon={
            <div
              className={`transition-transform transform ${
                !isPhoneExtensionPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  // setIsUserPickerVisible(!isUserPickerVisible);
                }}
              />
            </div>
          }
          onClickIcon={() => {
            setIsPhoneExtensionPickerVisible(!isPhoneExtensionPickerVisible);
          }}
          isDisabled={false}
          label={"ExtP"}
          name={"phoneExtensionPicker"}
          onChangeStyledInput={(event) => {
            setSearchTerm(event.target.value);
            setIsPhoneExtensionPickerVisible(true);
          }}
          onClickInput={() => {
            setIsPhoneExtensionPickerVisible(!isPhoneExtensionPickerVisible);
          }}
          styledInputValue={searchTerm}
          styledInputWidth="w-full"
        />
        {selectedCountryCode && (
          <span
            className={`absolute top-3 right-[1.2rem] fi fi-${selectedCountryCode.toLowerCase()}`}
          ></span>
        )}
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isPhoneExtensionPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {searchTerm === ""
            ? countries.map((country) => (
                <li
                  className="p-2 text-left text-xs transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={country.countryCode}
                  onClick={() => handleCountryClick(country)}
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-32 flex items-center space-x-2">
                      <span
                        className={`fi fi-${country.countryCode.toLowerCase()}`}
                      ></span>

                      <span>{country.countryName}</span>
                    </div>
                    <span className="w-10 h-6 flex items-center justify-center text-xs rounded-full border">
                      {country.phoneExtension}
                    </span>
                  </div>
                </li>
              ))
            : filteredCountries.map((filteredCountry) => (
                <li
                  className="p-2 text-left text-xs transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={filteredCountry.countryCode}
                  onClick={() => handleCountryClick(filteredCountry)}
                >
                  {/* <div className="flex items-center space-x-1">
                      <span
                        className={`fi fi-${filteredCountry.countryCode.toLowerCase()}`}
                      ></span>
                      &nbsp;
                      <span>{filteredCountry.countryName}</span>&nbsp;
                      <span className="w-10 h-6 flex items-center justify-center text-xs rounded-full border">
                        {filteredCountry.phoneExtension}
                      </span>
                    </div> */}
                  <div className="flex items-center space-x-1">
                    <div className="w-32 flex items-center space-x-2">
                      <span
                        className={`fi fi-${filteredCountry.countryCode.toLowerCase()}`}
                      ></span>

                      <span>{filteredCountry.countryName}</span>
                    </div>
                    <span className="w-10 h-6 flex items-center justify-center text-xs rounded-full border">
                      {filteredCountry.phoneExtension}
                    </span>

                    {/* <div>
                      {filteredCountries.length === 1 &&
                        (searchTerm.toLowerCase() ===
                          filteredCountry.countryName.toLowerCase() ||
                          searchTerm.toLowerCase() ===
                            filteredCountry.phoneExtension.toLowerCase() ||
                          searchTerm.toLowerCase() ===
                            filteredCountry.countryCode.toLowerCase() ||
                          searchTerm.toLowerCase() ===
                            `${filteredCountry.countryName.toLowerCase()} (${
                              filteredCountry.phoneExtension
                            })`) && <TiTick />}
                    </div> */}
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};
