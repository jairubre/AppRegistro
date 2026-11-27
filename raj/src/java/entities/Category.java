/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;
 
import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.util.List;
 
/**
 *
 * @author Jairubre
 */
@Entity
@Table(name = "category")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Category.findAll", query = "SELECT c FROM Category c"),
    @NamedQuery(name = "Category.findById", query = "SELECT c FROM Category c WHERE c.id = :id"),
    @NamedQuery(name = "Category.findByNameCategory", query = "SELECT c FROM Category c WHERE c.nameCategory = :nameCategory")})
public class Category implements Serializable {
 
    private static final long serialVersionUID = 1L;
    // Sin @NotNull ni @Basic(optional = false): el id llega a null al crear
    // y lo genera Hibernate con la tabla category_seq
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "nameCategory")
    private String nameCategory;
    @JoinTable(name = "product_category", joinColumns = {
        @JoinColumn(name = "category_id", referencedColumnName = "id")}, inverseJoinColumns = {
        @JoinColumn(name = "product_id", referencedColumnName = "id")})
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Product> productList;
    @OneToMany(mappedBy = "parentCategoryid", fetch = FetchType.EAGER)
    private List<Category> categoryList;
    @JoinColumn(name = "parentCategory_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Category parentCategoryid;
 
    public Category() {
    }
 
    public Category(Long id) {
        this.id = id;
    }
 
    public Category(Long id, String nameCategory) {
        this.id = id;
        this.nameCategory = nameCategory;
    }
 
    public Long getId() {
        return id;
    }
 
    public void setId(Long id) {
        this.id = id;
    }
 
    public String getNameCategory() {
        return nameCategory;
    }
 
    public void setNameCategory(String nameCategory) {
        this.nameCategory = nameCategory;
    }
 
    // Productos de la categoría: SOLO en XML.
    // En JSON no sale, porque en JSON la relación se ve desde Product.
    @JsonbTransient
    public List<Product> getProductList() {
        return productList;
    }
 
    public void setProductList(List<Product> productList) {
        this.productList = productList;
    }
 
    // No sale en JSON ni XML: corta el bucle hija -> padre -> hijas -> padre...
    @XmlTransient
    @JsonbTransient
    public List<Category> getCategoryList() {
        return categoryList;
    }
 
    public void setCategoryList(List<Category> categoryList) {
        this.categoryList = categoryList;
    }
 
    public Category getParentCategoryid() {
        return parentCategoryid;
    }
 
    public void setParentCategoryid(Category parentCategoryid) {
        this.parentCategoryid = parentCategoryid;
    }
 
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }
 
    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Category)) {
            return false;
        }
        Category other = (Category) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }
 
    @Override
    public String toString() {
        return "entities.Category[ id=" + id + " ]";
    }
 
}