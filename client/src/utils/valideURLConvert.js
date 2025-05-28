export const validURLConverter = (name) => {
    if (!name) return "";
    return name
      .toString()
      .replaceAll(" ", "-")
      .replaceAll("&", "-")
      .replaceAll(",", "-");
  };
  