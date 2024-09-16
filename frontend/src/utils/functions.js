export const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
        options.push({
          createdby : category.createdby,
          value: category._id,
          name: category.name,
          parentId: category.parentId,
          color: category.color,
          followers: category.followers,
          createdAt:category.createdAt
        });
        if (category.children.length > 0) {
            createCategoryList(category.children, options)
        }
    }

    return options;
}