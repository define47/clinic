import { FC, useEffect, useRef, useState } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { countryData } from "../../utils/countryData";
import { Country } from "../../types";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";

export const PhoneExtensionPicker: FC = () => {
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
    setSearchTerm(`${country.countryName} ${country.phoneExtension}`);
    setSelectedPhoneExtension(country.phoneExtension);
    setSelectedCountryCode(country.countryCode);
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
        .startsWith(searchTerm.toLowerCase());
      const countryNameAndPhoneExtensionMatch =
        `${filteredCountry.countryName.toLowerCase()} ${filteredCountry.phoneExtension.toLowerCase()}`.startsWith(
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
        filteredCountries[i].countryName.toLowerCase()
        //   ||
        // searchTerm.toLowerCase() !==
        //   `${filteredCountries[i].countryName} ${filteredCountries[i].phoneExtension}`
      ) {
        setSelectedCountryCode("");
        setSelectedPhoneExtension("");
      } else if (
        searchTerm.toLowerCase() ===
        filteredCountries[i].countryName.toLowerCase()
        //    ||
        // searchTerm.toLowerCase() ===
        //   `${filteredCountries[i].countryName} ${filteredCountries[i].phoneExtension}`
      ) {
        setSelectedCountryCode(filteredCountries[i].countryCode);
        setSelectedPhoneExtension(filteredCountries[i].phoneExtension);
        setSearchTerm(
          `${filteredCountries[i].countryName} ${filteredCountries[i].phoneExtension}`
        );
      }
    }

    console.log(filteredCountries);
  }, [filteredCountries, searchTerm]);

  useEffect(() => {
    console.log(
      "selected country",
      selectedCountryCode,
      selectedPhoneExtension
    );
  }, [selectedCountryCode, selectedPhoneExtension]);

  return (
    <div className="flex">
      <div className={`relative`} ref={phoneExtensionPickerRef}>
        <StyledInput
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
                  className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={country.countryCode}
                  onClick={() => handleCountryClick(country)}
                >
                  <div className="flex items-center space-x-1">
                    <span
                      className={`fi fi-${country.countryCode.toLowerCase()}`}
                    ></span>

                    <span>{country.countryName}</span>
                    <span>({country.phoneExtension})</span>
                  </div>
                </li>
              ))
            : filteredCountries.map((filteredCountry) => (
                <li
                  className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={filteredCountry.countryCode}
                  onClick={() => handleCountryClick(filteredCountry)}
                >
                  <div className="flex items-center space-x-1">
                    <span
                      className={`fi fi-${filteredCountry.countryCode.toLowerCase()}`}
                    ></span>
                    <span>{filteredCountry.countryName}</span>
                    <span>({filteredCountry.phoneExtension})</span>
                    {searchTerm.toLowerCase() ===
                      filteredCountry.countryName.toLowerCase() +
                        " " +
                        filteredCountry.phoneExtension && <TiTick />}
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};
