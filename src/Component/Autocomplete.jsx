import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Autocomplete({ data, isMultiple = false, template: Template }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [items, setItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      let mergedData = [];

      if (Array.isArray(data)) {
        for (const source of data) {
          // Pour mixer les données
          if (typeof source === "function") {
            const fetchedData = await source();
            mergedData = [...mergedData, ...fetchedData];
          } else if (Array.isArray(source)) {
            mergedData = [...mergedData, ...source];
          } else {
            mergedData.push(source);
          }
        }
      } else if (typeof data === "function") {
        // Si un fetch
        mergedData = await data();
      } else {
        // Si données en dur
        mergedData = data;
      }

      setItems(mergedData);
    };
    loadData();
  }, [data]);

  // Clic en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsDropdownVisible(true);

    const filtered = items.filter((item) => {
      const text = typeof item === "string" ? item : (Template ? item.name : item.text);
      return text && text.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredData(filtered);
  };

  const handleItemClick = (item) => {
    const identifier = typeof item === "string" ? item : (item.id || item.text || item.name);

    if (isMultiple) {
      if (selectedItems.some((selectedItem) => {
        const selectedId = typeof selectedItem === "string" ? selectedItem : (selectedItem.id || selectedItem.text || selectedItem.name);
        return selectedId === identifier;
      })) {
        setSelectedItems(selectedItems.filter((selectedItem) => {
          const selectedId = typeof selectedItem === "string" ? selectedItem : (selectedItem.id || selectedItem.text || selectedItem.name);
          return selectedId !== identifier;
        }));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setInputValue(typeof item === "string" ? item : (item.text || item.name));
      setFilteredData([]);
      setIsDropdownVisible(false);
    }
  };

  const handleCheckboxChange = (item) => {
    const identifier = typeof item === "string" ? item : (item.id || item.text || item.name);

    if (selectedItems.some((selectedItem) => {
      const selectedId = typeof selectedItem === "string" ? selectedItem : (selectedItem.id || selectedItem.text || selectedItem.name);
      return selectedId === identifier;
    })) {
      setSelectedItems(selectedItems.filter((selectedItem) => {
        const selectedId = typeof selectedItem === "string" ? selectedItem : (selectedItem.id || selectedItem.text || selectedItem.name);
        return selectedId !== identifier;
      }));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const isSelected = (item) => {
    const identifier = typeof item === "string" ? item : (item.id || item.text || item.name);
    return selectedItems.some((selectedItem) => {
      const selectedId = typeof selectedItem === "string" ? selectedItem : (selectedItem.id || selectedItem.text || selectedItem.name);
      return selectedId === identifier;
    });
  };

  return (
    <div className="auto-complete" ref={autocompleteRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Tapez pour rechercher..."
        onFocus={() => setIsDropdownVisible(true)}
      />

      {/* Selection multiple */}
      {isMultiple && selectedItems.length > 0 && (
        <div className="selected-items">
          {selectedItems.map((item, index) => (
            <span key={index} className="selected-item">
              {typeof item === "string" ? item : (item.text || item.name)}
            </span>
          ))}
        </div>
      )}

      <button className="icon">
        <FontAwesomeIcon icon={faSearch} />
      </button>

      {isDropdownVisible && inputValue && (
        <div className="autobox">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                className="auto-item"
                onClick={() => handleItemClick(item)}
              >
                {isMultiple && (
                  <input
                    type="checkbox"
                    checked={isSelected(item)}
                    onChange={() => handleCheckboxChange(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                
                {/* Gestion du template ou affichage basique */}
                {Template ? (
                  <Template element={item} />
                ) : (
                  typeof item === "object" && item.icon ? (
                    <>
                      <FontAwesomeIcon icon={item.icon} className="icon" />
                      {item.text}
                    </>
                  ) : (
                    typeof item === "object" ? item.text || item.name : item
                  )
                )}
              </div>
            ))
          ) : (
            <div className="auto-item">Aucun résultat</div>
          )}
        </div>
      )}
    </div>
  );
}